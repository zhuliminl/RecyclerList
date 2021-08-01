import React, { Component } from 'react';
import { View, StyleSheet, ActivityIndicator, Text, Image, RefreshControl } from 'react-native';
import RecyclerList from './index';
import { getRandomData } from './utils/help'



export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [{ title: '我是1', backgroundColor: 'blue' }, ...getRandomData(300)],
      // data: [{ title: '我是1',  backgroundColor: 'blue' }],
      data: [],
      headerHeight: 20,
      itemHeight: 200,
    }
  }

  componentDidMount = () => {
    setTimeout(() => {
      this.setState({
        data: this.state.data.concat(getRandomData(300)),
        // data: this.state.data.concat(getRandomData(20)),
        headerHeight: 300,
      })
    }, 2000);

  }


  renderHeader = () => {
    return (
      <View style={[styles.cell, {
        height: this.state.headerHeight,
        backgroundColor: 'red'
      }]}>
        <Text style={styles.title}>HeaderComponent</Text>
      </View>
    )
  }

  renderItem = ({ type, item, index }) => {
    // console.log('saul ', item, index, type)
    return (
      <View style={{
        borderRadius: 8,
        overflow: 'hidden',
        backgroundColor: item.backgroundColor,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        {/* <Image
          style={{
            height: this.state.itemHeight,
            // height: item.height,
            width: 400,
          }}
          source={{ uri: item.imageUrl || '' }}
        /> */}
        <Text style={styles.title}>{index}</Text>
        <Text style={styles.title}>{item.height}</Text>
      </View>
    )
  }

  renderFooter = () => {
    return (
      <View style={[styles.cell, { height: 200 }]}>
        <Text style={styles.title}>底部组件</Text>
      </View>
    )
  }

  onEndReached = () => {
    console.log('saul ##onEndReached')
  }

  onRefresh = () => {

  }

  viewChangeHandler = viewType => {
  }

  onItemLayout = e => {
    // console.log('saul itemlayout', e)
  }

  onScroll = e => {
    // console.log('saul onScroll', e)
  }

  onRecreate = e => {

  }

  onVisibleIndicesChanged = index => {
    console.log('saul onVisibleIndicesChanged', index)
  }

  render() {
    return (
      <View style={styles.container}>
        <RecyclerList
          marginHorizontal={10}
          numColumns={2}
          gap={10}
          renderHeader={this.renderHeader}
          renderFooter={this.renderFooter}
          renderItem={this.renderItem}
          headerHeight={this.state.headerHeight}
          itemHeight={this.state.itemHeight}
          onEndReached={this.onEndReached}
          onRefresh={this.onRefresh}
          data={this.state.data}

          onScroll={this.onScroll}
          initialOffset={1000}
          onRecreate={this.onRecreate}
          onVisibleIndicesChanged={this.onVisibleIndicesChanged}
          initialRenderIndex={9}
          scrollViewProps={{
            refreshControl: (
              <RefreshControl
                refreshing={this.state.loading}
                onRefresh={async () => {
                  this.setState({ loading: true });
                  setTimeout(() => {
                    this.setState({ loading: false });

                  }, 3000);
                }}
              />
            )
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'stretch',
    justifyContent: 'space-between',
    backgroundColor: '#FFF'
  },
  cell: {
    // height: 60,
    // width: 300,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#999',
  },
  title: {
    textAlign: 'center',
    color: '#FFF',
  }
});
