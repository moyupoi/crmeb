<!--倒计时展示 fontSize-->
<template>
  <view class="time" :style="justifyLeft">
    <text class="text" style="width: auto;">{{ tipText }}</text>
    <text class="styleAll p6 is_day" v-if="isDay === true && day>0"
          :style="{color:bgColor.bgColor, fontSize:bgColor.fontSize}">{{ day }}{{bgColor.isDay?'天':''}}</text>
    <text class="timeTxt" v-if="dayText"
          :style="{width:bgColor.timeTxtwidth,color:bgColor.bgColor}"> {{ dayText }} </text>
    <text class="styleAll" :class='isCol?"timeCol":""'
          :style="{background:bgColor.bgColor,color:bgColor.Color,width:bgColor.width, fontSize:bgColor.fontSize}">{{ hour }}</text>
    <text class="timeTxt" v-if="hourText" :class='isCol?"whit":""'
          :style="{width:bgColor.timeTxtwidth,color:bgColor.bgColor}"> {{ hourText }} </text>
    <text class="styleAll" :class='isCol?"timeCol":""'
          :style="{background:bgColor.bgColor,color:bgColor.Color,width:bgColor.width, fontSize:bgColor.fontSize}">{{ minute }}</text>
    <text class="timeTxt" v-if="minuteText" :class='isCol?"whit":""'
          :style="{width:bgColor.timeTxtwidth,color:bgColor.bgColor}"> {{ minuteText }}</text>
    <text class="styleAll" :class='isCol?"timeCol":""'
          :style="{background:bgColor.bgColor,color:bgColor.Color,width:bgColor.width,fontSize:bgColor.fontSize}">{{ second }}</text>
    <text class="timeTxt" v-if="secondText"> {{ secondText }} </text>
  </view>
</template>

<script>
export default {
  name: "countDown",
  props: {
    justifyLeft: {
      type: String,
      default: ""
    },
    //距离开始提示文字
    tipText: {
      type: String,
      default: "倒计时"
    },
    dayText: {
      type: String,
      default: "天"
    },
    hourText: {
      type: String,
      default: "时"
    },
    minuteText: {
      type: String,
      default: "分"
    },
    secondText: {
      type: String,
      default: "秒"
    },
    datatime: {
      type: Number,
      default: 0
    },
    isDay: {
      type: Boolean,
      default: true
    },
    isCol: {
      type: Boolean,
      default: false
    },
    bgColor: {
      type: Object,
      default: null
    },
    status: {
      type: Number,
      default: -1
    },
    //用于列表重处理单条数据，这条数据的对象
    dataItem: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      day: "00",
      hour: "00",
      minute: "00",
      second: "00",
      intv: undefined
    };
  },
  watch: {
    status(nal) {
      if (nal !== -1) {
        this.intv = undefined
        this.show_time();
      }
    },
    datatime(val){
      this.show_time();
    }
  },
  mounted() {
    this.show_time();
  },
  methods: {
    show_time() {
      let that = this;
      this.intv = setInterval(function() {
        that.runTime()
      }, 1000)
    },
    runTime() {
      let that = this;
      //时间函数
      let intDiff = that.datatime - Date.parse(new Date()) / 1000; //获取数据中的时间戳的时间差；
      let day = 0,
          hour = 0,
          minute = 0,
          second = 0;
      if (intDiff > 0) {
        //转换时间
        if (that.isDay === true) {
          day = Math.floor(intDiff / (60 * 60 * 24));
        } else {
          day = 0;
        }
        hour = Math.floor(intDiff / (60 * 60)) - day * 24;
        minute = Math.floor(intDiff / 60) - day * 24 * 60 - hour * 60;
        second =
            Math.floor(intDiff) -
            day * 24 * 60 * 60 -
            hour * 60 * 60 -
            minute * 60;
        if (hour <= 9) hour = "0" + hour;
        if (minute <= 9) minute = "0" + minute;
        if (second <= 9) second = "0" + second;
        that.day = day;
        that.hour = hour;
        that.minute = minute;
        that.second = second;
      } else {
        that.day = "00";
        that.hour = "00";
        that.minute = "00";
        that.second = "00";
        that.$emit('stopTime', false, this.dataItem)
        clearInterval(that.intv)
      }
    },

  },
  beforeDestroy() {
    clearInterval(this.intv)
  }
};
</script>

<style scoped lang="scss">
.p6 {
  padding: 0 8px;
}

.styleAll {
  font-size: 22px;
}

.timeTxt {
  text-align: center;
  display: inline-block;
  font-weight: 600;
}

.whit {
  color: #fff !important;
}

.time {
  display: flex;
  justify-content: center;
  align-items: center;
}

.red {
  color: #fc4141;
  margin: 0 2px;
}
.text{
  font-size: 10px;
  color: #2D2D2D;
  line-height: 18px;
}
.timeCol {
  color: #E93323;
}
</style>
