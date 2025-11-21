<template>
  <div class="shoppingCart">
    <div class="wrapper_1200">
      <div class="title w-1200px acea-row row-between">
        <div class="fontColor333 fonts16">购物车({{ useStore.carNumber }})</div>
      </div>
      <div class="acea-row h-50px b-rd-12px bg-#FFFFFF pl-30px py-16px mb-20px 48bfb4a">
        <div class="allSelect w-285px" @click="allChecked">
          <div class="checkbox-wrapper">
            <div class="well-check acea-row">
              <input type="checkbox" name="" value="" :checked="isAllSelect" @click="allChecked" />
              <i class="icon mr-10px" style="top: 9px"></i>
              <div class="checkAll text-14px text-#666">全选</div>
            </div>
          </div>
        </div>
        <div class="text-14px w-217px text-#666">商品信息</div>
        <div class="text-14px w-178px text-#666 text-center">单价</div>
        <div class="text-14px w-150px text-#666 text-center">数量</div>
        <div class="text-14px w-230px text-#666 text-center">金额</div>
        <div class="text-14px w-76px text-#666 text-center">操作</div>
      </div>
      <div ref="shoppingCartRef" v-loading="loading">
        <div class="cartList" v-if="cartList.cartValid.length > 0">
          <div
            class="borRadius mbtom20 item-box"
            v-for="(item, index) in cartList.cartValid"
            :key="index"
            style="overflow: hidden"
          >
            <div class="checkbox-wrapper acea-row mbtom30">
              <label class="well-check acea-row row-middle">
                <input type="checkbox" name="" value="" :checked="item.checked" @click="storeChecked(item, index)" />
                <i class="icon mr-24px cursors"></i>
              </label>
              <div @click.stop="handleIntoPage('/merchant/merchant_home', { merId: item.merId })" class="acea-row">
                <div v-if="item.merIsSelf">
                  <span
                    class="lh-12px bg-color inline-block text-12px text-#fff b-rd-2px py-2px mr-6px px-4px relative"
                    style="top: -2px"
                    >自营</span
                  >
                </div>
                <span class="checkAll fonts14 fontColor333 cursors">{{ item.merName }}</span>
              </div>
            </div>
            <div class="storeCartList">
              <div class="item acea-row row-middle mbtom30" v-for="(itemn, indexn) in item.cartInfoList" :key="indexn">
                <div class="allSelect acea-row row-center-wrapper">
                  <div class="checkbox-wrapper">
                    <label class="well-check"
                      >
                      <input
                        type="checkbox"
                        name=""
                        value=""
                        :checked="itemn.checked"
                        :disabled="itemn.deliveryMethod == 2"
                        @click="switchSelect(index, indexn)"
                      />
                      <i v-if="itemn.deliveryMethod == 2" class="icon cursors disabled"></i>
                      <i v-else class="icon cursors"></i>
                    </label>
                  </div>
                </div>
                <div class="info ml-20px acea-row row-middle cursors" @click="handlerProDetailLink(itemn.productId, 0)">
                  <el-image class="backImg" :src="itemn.image" lazy></el-image>
                  <div class="text">
                    <div class="name line1 fontColor333 text-14px font-500 oppoSans-M" :title="itemn.proName">
                      {{ itemn.proName }}
                    </div>
                    <div class="infor fontColor333 fonts14 font-400 oppoSans-R" v-if="itemn.sku">
                      规格：{{ itemn.sku }}
                    </div>
                    <div v-show="itemn.deliveryMethod == 2" class="font-color text-14px mt-15px">
                      仅支持到店自提的商品请使用移动端下单
                    </div>
                  </div>
                </div>
                <div class="price acea-row row-center-wrapper">￥{{ itemn.price }}</div>
                <div class="num acea-row row-center-wrapper">
                  <button
                    class="iconfont icon-shangpinshuliang-jian cursors flex-center"
                    :class="itemn.numSub ? 'greyCar' : ''"
                    @click.prevent="handleReduce(itemn)"
                  >
                    -
                  </button>
                  <input class="numCon" min="0" v-model="itemn.cartNum" type="number" @input="inputNum(itemn)" />
                  <button
                    class="iconfont icon-shangpinshuliang-jia rigth cursors flex-center"
                    :class="itemn.numAdd ? 'greyCar' : ''"
                    @click.prevent="handlePlus(itemn)"
                  >
                    +
                  </button>
                </div>
                <div class="money acea-row font-color justify-center" style="align-items: end">
                  <span class="text-12px font-600 dinProSemiBold">￥</span
                  ><span class="lh-18px font-600 dinProSemiBold text-18px">{{
                    (itemn.price * itemn.cartNum).toFixed(2)
                  }}</span>
                </div>
                <div class="operate">
                  <div
                    @click="handleCartToCollect(itemn.id)"
                    class="fonts14 fontColor6 lh-14px mb-15px cursors collect"
                  >
                    移入收藏夹
                  </div>
                  <div @click="handleDeleteGoods(itemn.id)" class="fonts14 fontColor6 lh-14px cursors delete">删除</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="cartList invalid borRadius" v-if="cartList.cartInvalid.length > 0">
          <div class="store-info acea-row row-between mbtom30">
            <div class="storeAllSelect cursor" @click="goodsOpen">
              <label class="well-check">
                <span
                  class="iconfont fonts14 fontColor333"
                  :class="goodsHidden == true ? 'icon-xiangxia' : 'icon-xiangshang'"
                  >失效商品</span
                >
              </label>
            </div>
            <div class="del" @click="unsetCart"><span class="fontColor6 fonts14 cursors">删除</span></div>
          </div>
          <div v-show="goodsHidden">
            <template v-for="(itemn, index) in cartList.cartInvalid" :key="index">
              <div
                class="item acea-row row-middle row-between mb-30px"
                v-for="(item, indexn) in itemn.cartInfoList"
                :key="indexn"
              >
                <div class="info acea-row row-center-wrapper">
                  <el-image class="backImg" :src="item.image" lazy></el-image>
                  <div class="text">
                    <div class="name line1 grey fonts16">{{ item.proName }}</div>
                    <div class="infor" v-if="item.suk">：{{ item.sku }}</div>
                  </div>
                </div>
                <div class="fonts14 fontColor333">该商品暂不支持购买</div>
              </div>
            </template>
          </div>
        </div>
        <div class="h-90px" v-if="!useStore.footerIsIntersecting"></div>
        <div
          :style="{ position: !useStore.footerIsIntersecting ? 'fixed' : 'static' }"
          class="footer acea-row row-between-wrapper bottom-0 z-10 70ba6a"
          v-if="cartList.cartValid.length || cartList.cartInvalid.length"
        >
          <div class="num acea-row">
            <div class="allSelect mr-20px" @click="allChecked">
              <div class="checkbox-wrapper">
                <div class="well-check acea-row">
                  <input type="checkbox" name="" value="" :checked="isAllSelect" @click="allChecked" />
                  <i class="icon cursors" style="top: 9px"></i>
                  <div class="checkAll text-14px text-#333 cursors">全选</div>
                </div>
              </div>
            </div>
            <div class="text-14px text-#333 mr-20px cursors" @click="handleDeleteAllGoods">删除选中</div>
            <div class="text-14px text-#333 cursors" @click="handleAllCartToCollect">移入收藏夹</div>
          </div>
          <div class="acea-row row-middle af90db">
            <div class="total text-14px text-#282828">
              合计：<span class="font-color text-14px oppoSans-M">￥</span
              ><span class="font-color text-22px font-600 dinProRegular">{{ countmoney }}</span>
            </div>
            <div class="bnt bg-color cursors" @click="handleSubOrder" v-loading="btnloading">
              去结算 ( {{ cartCount }} )
            </div>
          </div>
        </div>
        <div
          class="noCart 8bfb4"
          :style="{ height: ScrollHeight - 100 + 'px' }"
          v-if="!cartList.cartValid.length && !cartList.cartInvalid.length"
        >
          <empty-page title="购物车还是空的呦~">
            <template v-slot:emptyImage>
              <img src="@/assets/images/gouwukong.png" />
            </template>
          </empty-page>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { Add, Mul } from '~/utils/util'
//购物车有效商品列表
import { cartDeleteApi, cartListApi, cartNumApi, cartToCollectApi } from '~/server/orderApi'
import useOrder from '~/composables/useOrder'
import { ref } from 'vue'
import { useAppStore } from '~/stores/app'
const useStore = useAppStore()
const { handlerProDetailLink, handleIntoPage, onGetCartCount } = useOrder()
await onGetCartCount()

//购物车失效商品列表
const isAllSelect = ref(false)
const countmoney = ref(0)
const cartNum = ref(0)
const goodsHidden = ref(true)
const btnloading = ref(false)

//窗口的高度
const { getWindowHeight } = useScrollHeight()
const ScrollHeight = ref<number>(getWindowHeight() - 176 - 73) //购物车窗口的高度

/**
 * 购物车列表数据
 */
const {
  data: cartList,
  refresh,
  pending: loading,
} = await useAsyncData(async () => {
  const cartValid = await cartListApi(true)
  const cartInvalid = await cartListApi(false)
  let checked = []
  cartValid.forEach((cart) => {
    cart.cartInfoList.forEach((cartItem) => {
      if (checked.length) {
        cartItem.checked = checked.indexOf(cartItem.id) > -1
      } else {
        //  cartItem.checked = true
      }
      if (cartItem.cartNum === 1) {
        cartItem.numSub = true
      } else {
        cartItem.numSub = false
      }
      if (cartItem.cartNum === cartItem.stock) {
        cartItem.numAdd = true
      } else {
        cartItem.numAdd = false
      }
    })
  })
  return Promise.resolve({ cartValid, cartInvalid })
})
/**
 * 判断单个店铺是不是全选
 */
const storeAllChceked = async () => {
  let selectnum,
    selectAllnum = [],
    checknum = 0,
    cartValid = cartList.value.cartValid
  for (let j = 0; j < cartValid.length; j++) {
    selectnum = []
    for (let k = 0; k < cartValid[j]['cartInfoList'].length; k++) {
      // 除去到店自提的商品
      if (cartValid[j]['cartInfoList'][k].deliveryMethod != 2) checknum++
      if (cartValid[j]['cartInfoList'][k].checked) {
        selectnum.push(true)
        selectAllnum.push(true)
      } else {
        selectnum.length - 1
        selectAllnum.length - 1
      }
      // 除去到店自提的商品
      let checked = cartValid[j]['cartInfoList'].filter(item=>item.deliveryMethod != 2)
      cartValid[j]['checked'] = selectnum.length === checked.length
      isAllSelect.value = selectAllnum.length === checknum
    }
  }
}
storeAllChceked()

/**
 * 单个店铺商品全选
 * @param item
 * @param index
 */
const storeChecked = async (item: any, index: number) => {
  item.checked = !item.checked
  cartList.value.cartValid[index]['cartInfoList'].forEach((cart: object) => {
    cart.checked = item.checked
    if (cart.deliveryMethod == 2) cart.checked = false
  })
  await storeAllChceked()
  await countMoney()
}

/**
 * 单选
 * @param index
 * @param indexn
 */
const switchSelect = async (index: number, indexn: number) => {
  let cart = cartList.value.cartValid[index]['cartInfoList'][indexn]
  cart.checked = !cart.checked
  let len = 0
  let selectnum = []
  for (let j = 0; j < cartList.value.cartValid.length; j++) {
    for (let k = 0; k < cartList.value.cartValid[j]['cartInfoList'].length; k++) {
      len++
      if (cartList.value.cartValid[j]['cartInfoList'][k].checked === true) {
        selectnum.push(true)
      }
    }
  }
  isAllSelect.value = selectnum.length === len

  await storeAllChceked()
  await countMoney()
}

/**
 * 全选
 */
const allChecked = async () => {
  let selectAllStatus = isAllSelect.value
  selectAllStatus = !selectAllStatus
  cartList.value.cartValid.forEach((cart) => {
    cart.checked = selectAllStatus
    cart.cartInfoList.forEach((cartItem) => {
      cartItem.checked = cartItem.deliveryMethod != 2 ? selectAllStatus : false
    })
  })
  isAllSelect.value = selectAllStatus
  await countMoney()
}

const countNum = () => {
  let num = 0
  let checkedList = []
  cartList.value.cartValid.forEach((item) => {
    item.cartInfoList.forEach((cart) => {
      if (cart.checked) {
        checkedList.push(cart.id)
        num++
      }
    })
  })
  cartNum.value = num
}

/**
 * 计算总价
 */
const cartCount = ref<number>(0)
const countMoney = async () => {
  let carmoney = 0,
    totalNum = 0
  let array = cartList.value.cartValid
  for (let i = 0; i < array.length; i++) {
    for (let j = 0; j < array[i]['cartInfoList'].length; j++) {
      if (array[i]['cartInfoList'][j].checked === true) {
        carmoney = Add(carmoney, Mul(array[i]['cartInfoList'][j].cartNum, array[i]['cartInfoList'][j]['price']))
        totalNum += Number(array[i]['cartInfoList'][j].cartNum)
      }
    }
  }
  cartCount.value = totalNum
  countmoney.value = carmoney
  await countNum()
}
countMoney()

/**
 * 购物车加
 * @param goods
 * @param index
 */
const handlePlus = async (goods: product, index: number) => {
  goods.cartNum++
  if (goods.cartNum > goods.stock) {
    goods.cartNum = goods.stock
    goods.numAdd = true
    goods.numSub = false
    return
  } else if (goods.cartNum === goods.stock) {
    goods.numAdd = true
    goods.numSub = false
  } else {
    goods.numAdd = false
    goods.numSub = false
  }
  await countMoney()
  await syncCartNum(goods)
}
const syncCartNum = async (goods) => {
  await cartNumApi({ id: goods.id, number: goods.cartNum })
    .then(async (result: any) => {})
    .catch(async (err: any) => {
      goods.cartNum--
    })
}

//购物车减
const handleReduce = async (goods: any) => {
  if (goods.cartNum <= 1) {
    goods.cartNum = 1
    goods.numSub = true
  } else {
    goods.cartNum = Number(goods.cartNum) - 1
    goods.numSub = false
    goods.numAdd = false
    if (goods.cartNum <= 1) {
      goods.numSub = true
    }
    await countMoney()
    await syncCartNum(goods)
  }
}

//手动输入
const inputNum = async (item: any) => {
  if (item.cartNum < 0 || !item.cartNum) item.cartNum = 1
  item.cartNum = parseInt(item.cartNum) >= item.stock ? item.stock : item.cartNum
  item.cartNum = parseInt(item.cartNum) <= 1 || isNaN(parseInt(item.cartNum)) ? 1 : item.cartNum
  await countMoney()
  await syncCartNum(item)
}

/**
 * 购物车结算
 */
const handleSubOrder = async () => {
  let list = cartList.value.cartValid,
    id = []
  list.forEach(function (val) {
    val.cartInfoList.forEach(function (val) {
      if (val.checked === true) {
        id.push(val.id)
      }
    })
  })
  if (id.length === 0) {
    return feedback.msgWarning('请选择商品')
  }
  //btnloading.value = true
  await onPreOrder(id)
}

/**
 * 预下单
 * @param id
 */
const useOrders = useOrder()
const onPreOrder = async (id: Array<T>) => {
  let shoppingCartId = id.map((item: any) => {
    return {
      shoppingCartId: Number(item),
    }
  })
  await useOrders.getPreOrder('shoppingCart', shoppingCartId)
}

// 删除购物车商品
const handleDeleteGoods = async (id: number) => {
  await onDeleteGoods([id])
}

//删除失效商品
const unsetCart = async () => {
  let list = cartList.value.cartInvalid,
    id = []
  list.forEach(function (val: any) {
    val.cartInfoList.forEach(function (v: any) {
      id.push(v.id)
    })
  })
  await onDeleteGoods(id)
}

const getCheckedGoods = async () => {
  let list = cartList.value.cartValid,
    id = []
  list.forEach(function (val: any) {
    val.cartInfoList.forEach(function (v: any) {
      if (v.checked === true) {
        id.push(v.id)
      }
    })
  })
}

//删除全部
const handleDeleteAllGoods = async () => {
  let list = cartList.value.cartValid,
    id = []
  list.forEach(function (val: any) {
    val.cartInfoList.forEach(function (v: any) {
      if (v.checked === true) {
        id.push(v.id)
      }
    })
  })
  await onDeleteGoods(id)
}

// 删除商品调接口
const onDeleteGoods = async (ids: number[]) => {
  await cartDeleteApi({ ids })
  await refresh()
  await onGetCartCount()
  await countMoney()
  await storeAllChceked()
}

//移入收藏夹
const handleCartToCollect = async (id: number) => {
  await onCartToCollect([id])
}
//全部移入收藏库
const handleAllCartToCollect = async () => {
  let list = cartList.value.cartValid,
    id = []
  list.forEach(function (val: any) {
    val.cartInfoList.forEach(function (v: any) {
      if (v.checked === true) {
        id.push(v.id)
      }
    })
  })
  if(!id.length) return feedback.msgWarning('请选择商品')
  await onCartToCollect(id)
}
// 移入收藏库调接口
const onCartToCollect = async (ids: number[]) => {
  await cartToCollectApi({ ids })
  await refresh()
  await onGetCartCount()
  await countMoney()
  await storeAllChceked()
}
</script>
<style>
html {
  background: #f5f5f5 !important;
}
</style>
<style scoped lang="scss">
.disabled {
  background-color: #ccc;
}
.collect,
.delete {
  &:hover {
    color: #e93323;
  }
}
.numCon::after {
  content: none; /* 清空内容 */
}
@import '@/assets/scss/checkbox.scss';
.cursor {
  cursor: pointer;
}
.icon-xiangshang,
.icon-xiangxia {
  font-size: 14px !important;
}
.greyCar {
  color: #d0d0d0 !important;
  cursor: not-allowed;
}
.grey {
  color: #cccccc !important;
}
.shoppingCart {
  background-color: #f5f5f5;
  .noCart {
    padding-bottom: 1px;
    text-align: center;
    .pictrue {
      width: 274px;
      height: 174px;
      margin: 111px auto 0 auto;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .tip {
      font-size: 14px;
      color: #969696;
      margin-top: 20px;
    }
    .goIndex {
      width: 90px;
      height: 35px;
      border: 1px solid #282828;
      border-radius: 6px;
      text-align: center;
      line-height: 35px;
      font-size: 14px;
      color: #282828;
      margin: 24px auto 100px auto;
      display: block;
    }
  }
  .title {
    height: 73px;
    line-height: 73px;
    color: #999999;
    .home {
      color: #282828;
    }
  }
  .cartList {
    .item-box {
      padding: 30px;
      background: #fff;
    }
    .header {
      height: 54px;
      background: #eeeeee;
    }
    .checkAll {
      font-size: 14px;
      color: #333333;
    }
    .allSelect {
      position: relative;
    }
    .price {
      width: 180px;
    }
    .num {
      width: 150px;
    }
    .money {
      width: 230px;
    }
    .storeCartList {
      background: #fff;
    }
    .item {
      &:nth-last-child(1) {
        margin-bottom: 0 !important;
      }
      .info {
        .pictrue,
        .backImg {
          width: 100px;
          height: 100px;
          border-radius: 12px;
          margin-right: 20px;
          overflow: hidden;
          img {
            width: 100%;
            height: 100%;
          }
        }
        .text {
          width: 349px;
          .infor {
            margin-top: 10px;
          }
        }
      }
      .price {
        font-size: 14px;
      }
      .num {
        .iconfont {
          width: 40px;
          height: 34px;
          line-height: 34px;
          border: 1px solid #ccc;
          text-align: center;
          color: #999999;
          background-color: #fff;
          border-radius: 18px 0px 0px 18px;
        }
        .numCon {
          width: 54px;
          height: 32px;
          border: 0;
          border-top: 1px solid #cccccc;
          border-bottom: 1px solid #cccccc;
          font-size: 14px;
          color: #333333;
          text-align: center;
          line-height: 36px;
          outline: none;
        }
        .rigth {
          border-radius: 0px 18px 18px 0px !important;
        }
      }
      .money {
        font-size: 18px;
      }
      .operate {
        text-align: center;
      }
    }
    .iconfont {
      font-size: 20px;
    }
  }
  .store-info {
    background-color: #fff;
    align-items: center;
    .trader {
      display: inline-block;
      color: #fff;
      font-size: 12px;
      background-color: #e93323;
      width: 32px;
      height: 17px;
      line-height: 17px;
      text-align: center;
      border-radius: 2px;
      margin-left: 7px;
    }
  }
  .invalid {
    padding: 30px;
    margin-top: 20px;
    background-color: #fff;
  }
  .footer {
    width: 1200px;
    height: 66px;
    background: #ffffff;
    box-shadow: 0px -2px 6px 0px rgba(0, 0, 0, 0.05);
    margin-top: 20px;
    padding: 0 30px;
    border-radius: 12px;
    //position: fixed;
    //bottom: 0;
    .allSelect {
      position: relative;
      display: inline-block;
      .checkAll {
        margin-left: 10px;
      }
    }
    .bnt {
      height: 44px;
      text-align: center;
      line-height: 44px;
      font-size: 16px;
      color: #fff;
      margin-left: 30px;
      padding: 0 26px;
      border-radius: 33px 33px 33px 33px;
    }
  }
}
</style>
