<script lang="ts">
import { defineComponent, reactive, onMounted, ref } from '@vue/composition-api';

interface Props {
  data: unknown[];
}
export default defineComponent({
  props: {
    menus: {
      type: Array,
      required: true,
    },
  },
  methods: {
    visibleChange(item: any) {
      const { visible } = item;
      item.visible = visible === 'Y' ? 'N' : 'Y';
    },
    enabledChange(item: any) {
      const { enabled } = item;
      item.enabled = enabled === 'Y' ? 'N' : 'Y';
    }
  },
  render(h) {
    const renderDatas = (datas: any[]) => {
      const children: any[] = [];

      const ifDirective = (bool: boolean, element: any) => {
        if (bool) {
          return element;
        }

        return [];
      };

      datas.forEach((value) => {
        if (value.node === 'Y') {
          children.push(h(
            'dl',
            {},
            [
              h(
                'dt',
                {},
                [
                  h(
                    'a-checkbox',
                    {
                      props: {
                        checked: value.visible === 'Y'
                      },
                      on: {
                        change: () => {
                          this.visibleChange(value);
                        }
                      },
                    },
                    value.name
                  )
                ]
              ),
              renderDatas(value.subMenuList),
            ]
          ));
        } else {
          children.push(h(
            'dd',
            {},
            [
              h(
                'a-checkbox',
                {
                  props: {
                    checked: value.visible === 'Y'
                  },
                  on: {
                    change: () => {
                      this.visibleChange(value);
                    }
                  },
                },
                value.name
              ),
              ifDirective(value.featureList.length > 0, h('span', '功能:')),
              h(
                'div',
                {
                  class: 'features'
                },
                value.featureList.map((value: any) => {
                  return h(
                    'a-checkbox',
                    {
                      props: {
                        checked: value.enabled === 'Y'
                      },
                      on: {
                        change: () => {
                          this.enabledChange(value);
                        }
                      },
                    },
                    value.name
                  );
                })
              )
            ]
          ));
        }
      });
      return children;
    };

    return h('dl', {
      class: ['menus']
    }, renderDatas(this.menus as any[]));
  },
});
</script>

<style lang="scss" scoped>
.menus {
  dl {
    padding-left: 17px;
    border-left: 1px solid #AAA;
    margin-left: 8px;

    dt {
      margin: 0;
      padding: 10px 0;
    }

    dd {
      display: grid;
      grid-template-columns: max-content max-content auto;
      align-items: center;
      gap: 10px;
      margin: 0;
      margin-left: 8px;
      padding: 5px 15px;
      border-left: 1px solid #AAA;

      > .features {
        display: grid;
        grid-auto-flow: column;
        justify-content: start;
        gap: 10px;
      }
    }
  }

  > dl {
    border-left: none;
  }
}
</style>
