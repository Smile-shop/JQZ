<script lang="ts">
import { defineComponent, h, ref, reactive, onMounted, getCurrentInstance, watch } from '@vue/composition-api';

export default defineComponent({
  props: {
    organization: Object,
    type: {
      type: String,
      default: 'select',
    }
  },
  setup(props, { emit }) {
    const currentInstance = getCurrentInstance() as Vue;

    async function add(value: any) {
      emit('add', value);
    }
    async function remove(value: any) {
      emit('remove', value);
    }
    async function update(value: any) {
      emit('update', value);
    }

    // 项目点击
    const itemClick = (event: MouseEvent, value: any) => {
      const rootElement = currentInstance.$refs.rootElement;
      const target = event.target;

      if (rootElement) {
        const activeElement = (rootElement as Element).querySelectorAll('.active');
        activeElement.forEach((value: any) => {
          value.classList.remove('active');
        })

        if (target) {
          (target as HTMLElement).classList.add('active');
        }

        emit('selected', value);
      }
    }

    // 监听organization
    watch(() => props.organization, (value) => {
      if (props.type === 'edit') {
        const rootElement = currentInstance.$refs.rootElement as Element;
        const firstDlDt = rootElement.querySelector('dl:first-of-type > dt');

        if (rootElement) {
          const activeElement = (rootElement as Element).querySelectorAll('.active');
          activeElement.forEach((value: any) => {
            value.classList.remove('active');
          })

          if (firstDlDt) {
            (firstDlDt as HTMLElement).classList.add('active');
          }

          emit('selected', value);
        }
      }
    })

    // 控制菜单
    const controlMenuRender = (value: any) => {
      if (props.type === 'edit') {
        return h(
          'a-dropdown',
          [
            h(
              'a-icon',
              {
                props: {
                  type: 'ellipsis'
                },
              }
            ),
            h(
              'a-menu',
              {
                slot: 'overlay'
              },
              [
                h(
                  'a-menu-item',
                  {
                    on: {
                      click: () => {
                        add(value);
                      }
                    }
                  },
                  '添加子部门'
                ),
                h(
                  'a-menu-item',
                  {
                    on: {
                      click: () => {
                        update(value);
                      }
                    }
                  },
                  '修改名称',
                ),
                h(
                  'a-menu-item',
                  {
                    on: {
                      click: () => {
                        remove(value);
                      }
                    }
                  },
                  '删除'
                ),
              ]
            )
          ]
        )
      }

      return h();
    }

    // 渲染菜单
    const menuRender = (menus: any[]): any[] => {
      const renderMenus: any[] = [];

      if (menus instanceof Array) {
        menus.forEach((value) => {
          if (value.childOrgs && value.childOrgs.length) {
            renderMenus.push(h(
              'dl',
              {
                class: {
                  close: value.isOpen
                },
              },
              [
                h(
                  'dt',
                  {
                    on: {
                      click: (event: MouseEvent) => {
                        itemClick(event, value);
                      },
                    }
                  },
                  [
                    h(
                      'a-icon',
                      {
                        props: {
                          type: value.isOpen ? 'plus-square' : 'minus-square'
                        },
                        on: {
                          click(event: MouseEvent) {
                            event.stopPropagation();
                            event.preventDefault();
                            value.isOpen = value.isOpen ? false : true;
                            console.log(value.isOpen);
                            currentInstance.$forceUpdate();
                          }
                        },
                      }
                    ),
                    value.name,
                    controlMenuRender(value)
                  ],
                ),
                menuRender(value.childOrgs)
              ]
            ))
          } else {
            renderMenus.push(h(
              'dd',
              {
                on: {
                  click: (event: MouseEvent) => {
                    itemClick(event, value);
                  },
                }
              },
              [
                value.name,
                controlMenuRender(value),
              ]
            ))
          }
        })
      }

      return renderMenus;
    }

    return () => h(
      'div',
      {
        props: {
          title: '组织框架',
        },
        ref: 'rootElement',
        class: ['organization-tree'],
      },
      [
        menuRender([props.organization])
      ]
    );
  },
});
</script>

<style lang="scss" scoped>
.organization-tree {
  dl {
    margin: 0;
    margin-left: 20px;
    user-select: none;
    min-width: 150px;

    &.close {
      > dd {
        display: none;
      }

      > dl {
        display: none;
      }
    }

    dt {
      display: grid;
      align-items: center;
      grid-template-columns: max-content auto max-content;
      gap: 5px;
      height: 35px;
      color: #263446;
      font-weight: bold;
      cursor: pointer;

      &:hover {
        color: #0045FF;
      }

      &.active {
        border-bottom: 1px solid #0045FF;
        color: #0045FF;
      }
    }

    dd {
      display: grid;
      grid-template-columns: auto max-content;
      align-items: center;
      margin: 0;
      margin-left: 20px;
      height: 35px;
      color: #80869D;
      cursor: pointer;

      &:hover {
        color: #0045FF;
      }

      &.active {
        border-bottom: 1px solid #0045FF;
        color: #0045FF;
      }
    }
  }

  > dl {
    margin: 0;
  }
}
</style>
