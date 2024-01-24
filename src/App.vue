<template>
  <div class="framWork">

    <div class="header-context">
      <div class="header">
        <h1></h1>
      </div>
    </div>

    <div class="main-context">
      <div class="top">
        <div class="map">
          <mapBox />
          <!-- <mapBoxCopy/> -->
        </div>
        <div class="poetMigrationSequential">
          <poetMigrationSequential />
        </div>
      </div>
    </div>

    <div class="footer-context">
      <div class="stream">
        <stream />
      </div>
    </div>

  </div>
</template>

<script>
import mapBox from './components/mid/mapBox.vue'
import poetMigrationSequential from './components/mid/poetMigration_sequential.vue'
import mapBoxCopy from './components/mid/mapbox-copy.vue'
import stream from './components/bottom/stream.vue'

export default {
  name: 'App',
  components: {
    mapBox,
    poetMigrationSequential,
    mapBoxCopy,
    stream
  }
}

</script>

<style >
.framWork {
  width: 100%;
  height: 100%;
  position: fixed;
}

.framWork>.header-context {
  width: 100%;
  height: 1%;
  margin-bottom: 4px;
  border-radius: 5px;
  border: 1px solid steelblue;
  background-color: #f5f5f5;
}

.framWork>.main-context {
  width: 100%;
  height: 69%;
  margin-bottom: 4px;
  border-radius: 5px;
  border: 1px solid steelblue;
  background-color: #f5f5f5;
  display: flex;
  flex-wrap: wrap;
}

.framWork>.main-context>.top {
  width: 100%;
  height: 100%;
  border-radius: 5px;
  background-color: #f5f5f5;
  display: flex;
}

.framWork>.main-context>.top>.map {
  width: 65%;
  height: 100%;
  border-radius: 5px;
  background-color: #f5f5f5;
}

.framWork>.main-context>.top>.poetMigrationSequential {
  width: 35%;
  height: 100%;
}

.framWork>.footer-context {
  width: 100%;
  height: 29%;
  border-radius: 5px;
  border: 1px solid steelblue;
  background-color: #f5f5f5;
  display: flex;
  flex-direction: row;
}

.framWork>.footer-context>.stream {
  width: 100%;
  height: 100%;
  border-radius: 5px;
  background-color: #f5f5f5;
  display: flex;
}

* {
  margin: 0;
  padding: 0;
}
</style>
