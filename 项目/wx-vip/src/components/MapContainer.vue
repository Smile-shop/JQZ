<template>
  <div id="map-container"></div>
</template>

<script>
export default {
  props: ['storeList', 'currentPoint'],
  data() {
    return {
      map: null,
      markers: [],
      dpr: 1,
      image1: require('../assets/position_icon_man.png'),
      image2: require('../assets/position_icon_store.png')
    }
  },
  mounted() {
    // let htmlDom = document.querySelector('html');
    // this.dpr = htmlDom.dataset.dpr;
    // this.dpr = window.navigator.appVersion.includes('iPhone') ? 2 : 1;
    this.drawMap(this);
    this.drawMarks(this);
  },
  methods: {
    drawMap(self) {
      self.map = new AMap.Map("map-container", {
        resizeEnable: true,
        zoom: 18
      });
      let startIcon = new AMap.Icon({
        size: new AMap.Size(30*this.dpr, 30*this.dpr),
        imageSize: new AMap.Size(30*this.dpr, 30*this.dpr),
        image: this.image1
      })

      var marker = new AMap.Marker({
        map: self.map,
        position: self.currentPoint,
        offset: new AMap.Pixel(0, -30),
        icon: startIcon,
        zIndex: 5000
      });
      marker.content = `<strong>信息</strong><p>您当前位置</p>`
      marker.on('click', markerClick);
      let infoWindow = new AMap.InfoWindow({offset: new AMap.Pixel(15, -30)});

      function markerClick(e) {
        infoWindow.setContent(e.target.content);
        infoWindow.open(self.map, e.target.getPosition());
        self.map.setFitView();
      };
      // 打开信息窗体
      infoWindow.open(self.map);

      self.map.add(marker);
    },
    drawMarks(self) {
      let infoWindow = new AMap.InfoWindow({offset: new AMap.Pixel(15, -30)});

      let shopIcon = new AMap.Icon({
        size: new AMap.Size(30*this.dpr, 30*this.dpr),
        imageSize: new AMap.Size(30*this.dpr, 30*this.dpr),
        image: this.image2
      })

      self.storeList.forEach(function(item) {
        let marker = new AMap.Marker({
          map: self.map,
          position: item.point,
          offset: new AMap.Pixel(0, -30),
          icon: shopIcon,
          zIndex: 5000
        });

        marker.content = `${item.shopName}<br>电话：${item.phone ? item.phone : ''}`
        marker.on('click', markerClick);
      });

      function markerClick(e) {
        infoWindow.setContent(e.target.content);
        infoWindow.open(self.map, e.target.getPosition());
        self.map.setFitView();
      };

      self.map.setFitView();
    }
  }
};
</script>


<style scoped lang="less">
#map-container {
  width: 100%;
  height: calc(100vh - 105px);
  img {
    max-width: inherit;
  }
}
</style>

