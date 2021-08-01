# RecyclerList
RecyclerList based on RecyclerListView, provide API with Flastlist like

### Install

```
npm i react-native-recyclerlist-v1 --save
```

### Usage

```javascript
import RecyclerList from 'react-native-recyclerlist-v1'


        <RecyclerList
          marginHorizontal={10}
          numColumns={2}
          gap={10}
          renderHeader={this.renderHeader}
          renderFooter={this.renderFooter}
          renderItem={this.renderItem}
          headerHeight={this.state.headerHeight}
          onEndReached={this.onEndReached}
          onRefresh={this.onRefresh}
          data={this.state.data} // if item height has provide, Preferred over itemHeight if both specified
          itemHeight={ITEM_HEIGHT} 

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

```

### API

most support hae been list as example fold.
if you want to make cross row support, make sure you data item has **isCrossRow** property set

### Features

base on recyclerlistview while with no layoutProvider manully set
simply to use as normal list
suppprt mixed layout with maltiple columns



https://user-images.githubusercontent.com/20069490/127765705-0df5eb5a-4466-4e71-a0f0-2193c42b73c5.mp4



### Feedback

wellcome
