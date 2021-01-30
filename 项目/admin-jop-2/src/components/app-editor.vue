<template>
  <Editor
    api-key="1u3q4numka4bl7c8wxh1ovg9nov7776vtvvchisifovkvsj9"
    :init="init"
    v-model="data.editorValue"
    @onSelectionChange="onChange"
  />
</template>

<script lang="ts">
import { defineComponent, reactive, onMounted, ref, watch } from '@vue/composition-api';
import { upLoadImage } from '@/api/common/image';
import Editor from '@tinymce/tinymce-vue'

export default defineComponent({
  components: {
    Editor,
  },
  props: {
    value: String
  },
  setup(props, { emit }) {
    const data = reactive({
      editorValue: '',
    })
    const init = ref({
      language: 'zh_CN',
      auto_focus: true,
      branding: false,
      plugins: ['image'],
      toolbar: 'undo redo | image | bold italic underline strikethrough | fontsizeselect formatselect | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist checklist | forecolor backcolor casechange permanentpen formatpainter removeformat | pagebreak',
      min_height: 500,
      async images_upload_handler(blobInfo: any, succFun: any, failFun: any) {
        try {
          const file = blobInfo.blob();
          const body = new FormData();
          body.append('file', file, file.name);

          const res = await upLoadImage(body);
          succFun(res.imgFullPathUrl);
        } catch (error) {
          failFun(error);
          console.warn(error);
        }
      }
    })

    watch(() => props.value, (value) => {
      if (value) {
        data.editorValue = props.value as string;
        console.log(value);
      }
    });

    function onChange(event: Event, editor: any) {
      const content = editor.getContent();
      emit('input', content);
    }

    return {
      data,
      init,
      onChange
    };
  },
});
</script>
<style lang="scss" scoped>
</style>
