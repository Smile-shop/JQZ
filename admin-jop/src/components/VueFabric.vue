<template>
  <div class="canvas-container" @drop="onDrop" @dragover="allowDrop">
    <canvas :id="id" :width="width" :height="height"></canvas>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop, Emit} from 'vue-property-decorator';
import { fabric } from 'fabric';
@Component({})
export default class VueFabric extends Vue {
    @Prop({ default: 'fabricCanvas' , required: false})
    id!: string
    @Prop()
    width!: number
    @Prop()
    height!: number
    fabricCanvas: any
    // currtOpt: any
    @Emit('onUpdataCanvas')
    // tslint:disable-next-line:no-empty
    onUpdataCanvas() {}
    @Emit('onUpdataItem')
    // tslint:disable-next-line:no-empty
    onUpdataItem(...options: any[]) {}


    mounted() {
        this.fabricCanvas = new fabric.Canvas(this.id , { preserveObjectStacking: true, selection: false });
        this.fabricCanvas.hoverCursor = 'pointer';
        this.fabricCanvas.backgroundColor = '#ffffff';
        this.fabricCanvas.controlsAboveOverlay = false;
        this.fabricCanvas.skipOffscreen = true;
        this.fabricCanvas.controlsAboveOverlay = false;
        const that = this;
        this.fabricCanvas.on('selection:created', (...options: any[]) => {
            that.$emit('selection:created', options);
        });
        this.fabricCanvas.on('mouse:down', (...options: any[]) => {
            // this.currtOpt = options[0].target;
            that.$emit('mouse:down', options);
        });
        this.fabricCanvas.on('mouse:up', (...options: any[]) => {
            that.$emit('mouse:up', options);
        });
        this.fabricCanvas.on('mouse:move', (...options: any[]) => {
            that.$emit('mouse:move', options);
        });
        this.fabricCanvas.on('mouse:dblclick', (...options: any[]) => {
            that.$emit('mouse:dblclick', options);
        });
        this.fabricCanvas.on('mouse:over', (...options: any[]) => {
            that.$emit('mouse:over', options);
        });
        this.fabricCanvas.on('mouse:out', (...options: any[]) => {
            that.$emit('mouse:out', options);
        });
        this.fabricCanvas.on('object:added', (...options: any[]) => {
            that.$emit('object:added', options);
            this.onUpdataCanvas();
        });
        this.fabricCanvas.on('object:removed', (...options: any[]) => {
            that.$emit('object:removed', options);
            this.onUpdataCanvas();
        });
        this.fabricCanvas.on('object:selected', (...options: any[]) => {
            that.$emit('object:selected', options);
        });
        this.fabricCanvas.on('object:modified', (...options: any[]) => {
            that.$emit('object:modified', options);
            this.onUpdataCanvas();
            this.onUpdataItem(options);
        });
        this.fabricCanvas.on('object:rotating', (...options: any[]) => {
            that.$emit('object:rotating', options);
        });
        this.fabricCanvas.on('object:scaling', (...options: any[]) => {
            that.$emit('object:scaling', options);
        });
        this.fabricCanvas.on('object:moving', (...options: any[]) => {
            const obj = options[0].target;
            // if object is too big ignore
            if (obj.currentHeight > obj.canvas.height || obj.currentWidth > obj.canvas.width) {
                return;
            }
            obj.setCoords();
            // top-left  corner
            if (obj.getBoundingRect().top < 0 || obj.getBoundingRect().left < 0) {
                obj.top = Math.max(obj.top, obj.top - obj.getBoundingRect().top);
                obj.left = Math.max(obj.left, obj.left - obj.getBoundingRect().left);
            }
            // bot-right corner
            if (obj.getBoundingRect().top + obj.getBoundingRect().height  > obj.canvas.height || obj.getBoundingRect().left + obj.getBoundingRect().width  > obj.canvas.width) {
                obj.top = Math.min(obj.top, obj.canvas.height - obj.getBoundingRect().height + obj.top - obj.getBoundingRect().top);
                obj.left = Math.min(obj.left, obj.canvas.width - obj.getBoundingRect().width + obj.left - obj.getBoundingRect().left);
            }
            that.$emit('object:moving', options);
        });
        this.fabricCanvas.on('selection:updated', (...options: any[]) => {
            that.$emit('selection:updated', options);
        });
        this.fabricCanvas.on('selection:cleared', (...options: any[]) => {
            that.$emit('selection:cleared', options);
        });
        this.fabricCanvas.on('before:selection:cleared', (...options: any[]) => {
            that.$emit('before:selection:cleared', options);
        });

        fabric.Object.prototype.setControlsVisibility({
          bl: true, // 左下
          br: true, // 右下
          mb: false, // 下中
          ml: false, // 中左
          mr: false, // 中右
          mt: false, // 上中
          tl: true, // 上左
          tr: true, // 上右
          mtr: true // 旋轉控制鍵
      });
        fabric.Object.prototype.set({

      });
      //// 只對 rect 的控制項做修改
      // rect.setControls({
      //   ...
      // })
    }

    public removeItem(item: any): void {
      this.fabricCanvas.remove(item);
      this.fabricCanvas.requestRenderAll();
    }

    public updataText(item: any, color: string, fontSize: number) {
        const canvas = this.fabricCanvas;
        canvas.discardActiveObject();
        canvas.setActiveObject(item);
        item.set('fill', color);
        item.set('fontSize', fontSize);
        item.set('width', item.dynamicMinWidth);
        item.setCoords();
        canvas.requestRenderAll();
    }

    public updataItem(item: any, width: number, height: number): void {
        const canvas = this.fabricCanvas;
        canvas.discardActiveObject();
        canvas.setActiveObject(item);
        item.scaleToWidth(width, true);
        item.scaleToHeight(height, true);
        canvas.requestRenderAll();
    }

    public setBackgroundImage(url: string, options?: any) {
        const canvas = this.fabricCanvas;
        fabric.Image.fromURL(url, (img: any) => {
          img.set({
            scaleX: canvas.width / img.width,
            scaleY: canvas.height / img.height,
          })

          // if (img.width >= canvas.width) {
          //   img.set({
          //     scaleX: canvas.width / img.width,
          //     scaleY: canvas.width / img.width,
          //   })
          // }
          canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas));
          canvas.requestRenderAll();
          this.onUpdataCanvas();
        }, {crossOrigin: 'anonymous'});
    }


    public createText(options: any) {
        const canvas = this.fabricCanvas;
        const textbox = new fabric.Textbox(options.context, {
          id: options.id,
          left: options.left,
          top: options.top,
          fontSize: options.fontSize,
          hasControls: true,
          hasBorders: true,
          fill: options.fill,
          editable: options.editable,
          lockRotation: options.lockRotation,
          hasRotatingPoint: options.hasRotatingPoint
        });
        canvas.add(textbox);
        this.fabricCanvas.requestRenderAll();
    }

    public toDataUrl(): any {
        const MIME_TYPE = 'image/png';
        return this.fabricCanvas.toDataURL(MIME_TYPE);
    }

    public createImage(url: string, options?: any) {
      const canvas = this.fabricCanvas;
      canvas.discardActiveObject();
      const that = this;
      fabric.Image.fromURL(url,  (img: any) => {
        const maxWidth = that.width / 2;
        let newWidth = 0;
        let newHeight = 0;
        if (img.width > img.height) {
          if (img.width > maxWidth) {
            newWidth = maxWidth;
            newHeight = (img.height / img.width) * newWidth;
          } else {
            newWidth = img.width;
            newHeight = img.height;
          }
        } else {
          if (img.height > maxWidth) {
            newHeight = maxWidth;
            newWidth = (img.width / img.height) * newHeight;
          } else {
            newWidth = img.width;
            newHeight = img.height;
          }
        }
        if (options && options.width) {
          newWidth = options.width;
        }
        if (options && options.height) {
          newHeight = options.height;
        }
        let leftP = that.width / 2;
        let topP = that.height / 2;
        if (options && options.left) {
          leftP = options.left;
        }
        if (options && options.top) {
          topP = options.top;
        }
        img.set({
          id: (options && options.id) ? options.id : 'image',
          left: leftP,
          top: topP,
          scaleX: (newWidth / img.width),
          scaleY: (newHeight / img.height),
          originX: 'center',
          originY: 'center',
          cornerStrokeColor: 'blue',
          lockRotation: options.lockRotation,
          hasRotatingPoint: options.hasRotatingPoint
        });
        const oldOriginX = img.get('originX');
        const oldOriginY = img.get('originY');
        const center = img.getCenterPoint();
        img.hasControls = options.hasControls;
        img.hasBorders = options.hasBorders;
        canvas.add(img); // 把图片添加到画布上
        this.fabricCanvas.requestRenderAll();
        if (options && options.registeObjectEvent) {
          this.registeObjectEvent(that, img);
        }
        canvas.renderAll.bind(canvas);
      }, {crossOrigin: 'anonymous'});
    }
     // 导出图片
    public onImageSave() {
        this.canvasToImage();
    }
    // 获取激活对象
    public getObjeById(id: string): any {
        const objs: any[] = this.fabricCanvas.getObjects();
        const  item: any = objs.find(obj => {
          return obj.id === id;
        });
        return item;
    }

    private onDrop(ev: any) {
        const imgstr = ev.dataTransfer.getData('Text');
        const imgdata = JSON.parse(imgstr);
        this.addImagetoCanves(ev.offsetX, ev.offsetY, imgdata);
        ev.preventDefault();
    }

    private addImagetoCanves(offsetX: number, offsetY: number, imgdata: any) {
        const canvas = this.fabricCanvas;
        fabric.Image.fromURL(imgdata.src,  (img: any) => {
            img.set({
              left: offsetX - imgdata.mouseX,
              top: offsetY - imgdata.mouseY
            });
            canvas.add(img); // 把图片添加到画布上
            canvas.setActiveObject(img);
            this.fabricCanvas.requestRenderAll();
        }, {crossOrigin: 'anonymous'});
    }

    private allowDrop(ev: any) {
        ev.preventDefault();
    }

    private registeObjectEvent(me: any, obj: any) {
      obj.on('mousedown', (...options: any[]) => {
        me.$emit('object:mousedown', obj, options);
      });
      obj.on('mouseup', (...options: any[]) => {
        me.$emit('object:mouseup', obj, options);
      });
      obj.on('mousemove', (...options: any[]) => {
        me.$emit('object:mousemove', obj, options);
      });
      obj.on('mouseover', (...options: any[]) => {
        me.$emit('object:mouseover', obj, options);
      });
      obj.on('mouseout', (...options: any[]) => {
        me.$emit('object:mouseout', obj, options);
      });
      obj.on('mousedblclick', (...options: any[]) => {
        me.$emit('object:mousedblclick', obj, options);
      });
      obj.on('mousewheel', (...options: any[]) => {
        me.$emit('object:mousewheel', obj, options);
      });
    }

    private canvasToImage() {
        const MIME_TYPE = 'image/png';
        const imgURL = this.fabricCanvas.toDataURL(MIME_TYPE);
    　　// 创建一个a链接，模拟点击下载
        const dlLink = document.createElement('a');
        const filename = 'playbill.png';
        dlLink.download = filename;
        dlLink.href = imgURL;
        dlLink.dataset.downloadurl = [MIME_TYPE, dlLink.download, dlLink.href].join(':');
        document.body.appendChild(dlLink);
        dlLink.click();
        document.body.removeChild(dlLink);
    }
}
</script>

<style lang="scss" scoped>
.canvas-container {
    border: 1px dotted #ccc;
    display: inline-block;
    vertical-align: top;
    -webkit-tap-highlight-color: rgba(0,0,0,0);
}
</style>