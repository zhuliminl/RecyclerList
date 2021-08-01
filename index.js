import React, { Component } from 'react';
import { View, StyleSheet, ActivityIndicator, Text, Dimensions } from 'react-native';
import { RecyclerListView, DataProvider, LayoutProvider } from 'recyclerlistview';

const getContainerWidth = (margin = 0) => {
  // To deal with precision issues on android
  // return Math.round(Dimensions.get('window').width * 1000) / 1000 - 6; //Adjustment for margin given to RLV;
  return Math.round(Dimensions.get('window').width * 1000) / 1000 - (margin * 2)
}

const ViewTypes = {
  'HEADER': 'HEADER',
  'ITEM': 'ITEM'
}

/**
 * 对 recyclerlistview 的一层简化封装，提供 renderHeader 支持
 * 同时提供对外必须接口，以支持 renderHeader
 * 简化数据提供
 * 需要解决的问题，单个 Item 的绝对高度，原则上是允许写死直接传递设定的。但是 Header 这个组件，必须要支持动态展示
 * itemHeight 默认从 props 中取，如果 item data 中存在，则默认取 item 自定义的 height
 */

export default class RecylclerList extends Component {
  constructor(props) {
    super(props);
  }

  getItemWidth = (type, isCrossRow) => {
    const containerWidth = getContainerWidth(this.props.marginHorizontal)
    const { numColumns = 1 } = this.props
    if (isCrossRow) {
      return containerWidth
    }
    if (type === ViewTypes.HEADER) {
      return containerWidth
    }
    return containerWidth / numColumns
  }

  createLayoutProvider = ({
    headerHeight = 0,
    itemHeight = 0,
  }) => {
    const renderData = [{}, ...this.props.data]
    return new LayoutProvider(
      index => {
        if (index === 0) {
          return ViewTypes.HEADER
        }

        // 自定义 item 的高度
        const item = renderData[index] || {}
        if (item.height) {
          return item.height
        }

        return ViewTypes.ITEM
      },
      (type, dim, index) => {

        const item = renderData[index] || {}
        const isCrossRow = item.isCrossRow || false
        let itemWidth = this.getItemWidth(type, isCrossRow)
        if (item.height) {
          dim.width = itemWidth
          dim.height = item.height
          return
        }

        if (type === ViewTypes.HEADER) {
          dim.width = itemWidth
          dim.height = headerHeight
          return
        }

        if (type === ViewTypes.ITEM) {
          dim.width = itemWidth
          dim.height = itemHeight
          return
        }

        dim.width = 0
        dim.height = 0
        return
      }
    )
  }

  getRowDemensions = (type, index) => {
    const { itemHeight = 10, } = this.props
    const renderData = [{}, ...this.props.data]
    const item = renderData[index] || {}
    const isCrossRow = item.isCrossRow || false

    return {
      height: item.height || itemHeight,
      width: this.getItemWidth(type, isCrossRow)
    }
  }


  /*
   * 钩子事件
   */
  viewChangeHandler = viewType => {
  }


  onEndReached = () => {
    const { onEndReached } = this.props
    onEndReached && onEndReached()
  }

  /*
   * 渲染层
   */
  renderHeader = () => {
    const { renderHeader } = this.props
    if (renderHeader) {
      return renderHeader()
    }
    return this.renderDefaltView('HEADER')
  }

  rowRenderer = (type, item = {}, index) => {
    const { renderItem = () => null, data = [] } = this.props
    if (type === ViewTypes.HEADER) {
      return this.renderHeader()
    }


    // 处理跨行的错差
    const preData = data.slice(0, index)
    const preCrossCount = preData.filter(_ => _.isCrossRow).length || 0

    // 解决裁切问题。Android 默认会裁切，但是 ios 不裁切会超出当前设定的宽高度
    const { height = 0, width = 0 } = this.getRowDemensions(type, index)
    const { gap = 0, numColumns = 1 } = this.props
    let isLeftSide = (index - 1 - preCrossCount) % numColumns === 0

    // console.log('saul isLeftSide', isLeftSide, index)

    if (item.isCrossRow) {
      isLeftSide = true
    }

    return (
      <View
        style={{
          overflow: 'hidden',
          height,
          width,
        }}
      >
        <View style={{
          flex: 1,
          paddingLeft: isLeftSide ? 0 : gap,
          paddingTop: gap,
        }}>
          {renderItem({ type, item, index })}
        </View>
      </View>
    )
    // return this.renderDefaltView('ITEM')
  }

  renderFooter = () => {
    const { renderFooter } = this.props
    if (renderFooter) {
      return renderFooter()
    }
    return this.renderDefaltView('FOOTER')
  }

  renderDefaltView = (viewName) => {
    return (
      <View style={styles.defaultViewContianer}><Text style={styles.defaultViewText}>{viewName || 'defaultView'}</Text></View>
    )
  }

  render() {
    const renderData = [{}, ...this.props.data]

    let dataProvider = new DataProvider((r1, r2) => {
      return r1 !== r2;
    }).cloneWithRows(renderData) // 注意处理 header 的项

    const { headerHeight = 0, itemHeight = 10, } = this.props
    let layoutProvider = this.createLayoutProvider({ headerHeight, itemHeight })

    const {
      onItemLayout = () => { },
      onRecreate = () => { },
      onScroll = () => { },
      onVisibleIndicesChanged = () => { },
      style = {},
      scrollViewProps = {},
      initialOffset = 0,
      initialRenderIndex = 0
    } = this.props

    return (
      <RecyclerListView
        style={[{ flex: 1, style }]}
        contentContainerStyle={{ marginHorizontal: this.props.marginHorizontal || 0 }}
        onEndReached={this.onEndReached}
        dataProvider={dataProvider}
        layoutProvider={layoutProvider}
        rowRenderer={this.rowRenderer}
        renderFooter={this.renderFooter}
        canChangeSize={true}
        onScroll={onScroll}
        onRecreate={onRecreate}
        onVisibleIndicesChanged={onVisibleIndicesChanged}
        initialOffset={initialOffset}
        scrollViewProps={scrollViewProps}
        {...(initialRenderIndex && !!this.props.data.length ? { initialRenderIndex } : {})}
        // forceNonDeterministicRendering={true}
        // onItemLayout={onItemLayout}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  defaultViewContianer: {
    borderWidth: 0.5,
    borderColor: '#999',
    // height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF'
  },
  defaultViewText: {
    textAlign: 'center',
  },

});
