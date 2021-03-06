import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { observer, inject } from 'mobx-react';
import Swiper from 'react-native-swiper';
import PropTypes from 'prop-types';
import LinearGradient from 'react-native-linear-gradient';

import style from './style';
import Card from '../Card';

function formatCards(cards) {
  const len = Math.ceil(cards.length / 2);
  const newCards = [];
  for (let i = 0; i < len; i++) {
    newCards.push([cards[i * 2], (i * 2) + 1 < cards.length ? cards[(i * 2) + 1] : null]);
  }
  return newCards;
}

@inject('liveState')
@observer
export default class Home extends Component<{}> {
  static propTypes = {
    navigator: PropTypes.object.isRequired,
    containerStyle: PropTypes.number,
    liveState: PropTypes.shape({
      list: PropTypes.object,
      fetch: PropTypes.func,
      refresh: PropTypes.func,
    }),
  }

  static defaultProps = {
    liveState: {},
    containerStyle: null,
  }

  constructor(props) {
    super(props);

    this.state = {
      isRefreshing: false,
    };
  }

  componentWillMount() {
    console.log(1111);
    this.props.liveState.fetch();
  }
  componentWillUnmount() {
    console.log(11111);
  }

  onRefresh = () => {
    const { refresh } = this.props.liveState;
    this.setState({ isRefreshing: true });
    refresh().then(() => {
      this.setState({ isRefreshing: false });
    });
  }

  renderTabBar = () => {
    const tabs = ['热门', '最新', '时尚', '热舞', '抖音'];

    return (
      <View style={style.tabBar}>
        <LinearGradient
          colors={['#B11472', '#D01670', '#E61D72', '#E73151', '#E86224', '#F5D423']}
          locations={[0, 0.2, 0.3515, 0.5455, 0.7525, 1]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
        >
          <ScrollView
            style={style.tabsContainer}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
          >
            {tabs.map(tab => (
              <TouchableOpacity
                activeOpacity={0.8}
                key={tab}
                style={style.tabBtn}
              >
                <Text style={style.tabText}>{tab}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </LinearGradient>

      </View>
    );
  }

  renderViewPager() {
    // const datasource = new ViewPager.DataSource({ pageHasChanged: (p1, p2) => p1 !== p2 });
    const datas = [
      { img: 'http://p1.music.126.net/Pt6SIKQLUXXTJ7T6ewU9EQ==/19087521858270261.jpg' },
      { img: 'http://image13-c.poco.cn/mypoco/qing/20120828/13/2140935331091696685_500x411_220.jpg' },
      { img: 'http://a.hiphotos.baidu.com/baike/pic/item/d4628535e5dde711b8f52eabaeefce1b9d166143.jpg' },
    ];
    // const ds = datasource.cloneWithPages(data.get('banner').toArray());
    return (
      <View style={style.swiperContainer}>
        <Swiper
          autoplay={true}
          autoplayTimeout={5}
          dotStyle={style.dot}
          activeDotStyle={style.activeDot}
        >
          {datas.map(data => (
            <Image
              key={data.img}
              resizeMode="cover"
              style={style.bannerImg}
              source={{ uri: data.img }}
            />
          ))}
        </Swiper>
      </View>
    );
  }

  renderCardList() {
    const { navigator, liveState } = this.props;
    const { list } = liveState;
    const cards = formatCards(list);
    /* eslint-disable */
    return (
      <View style={style.cardListCont}>
        {cards.map((row, inx) => (
          <View key={`card-row-${inx}`} style={style.listRow}>
            {row.map((card) => {
              if (card) {
                return <Card key={card.liveId} card={card} navigator={navigator} />;
              }
              return null;
            })}
          </View>
          ))
        }
      </View>
    );
  }

  render() {
    const { containerStyle } = this.props;
    return (
      <View style={[style.page, containerStyle]}>
        {this.renderTabBar()}
        <ScrollView
          style={style.scrollCont}
          refreshControl={
            <RefreshControl
              refreshing={this.state.isRefreshing}
              onRefresh={this.onRefresh}
              tintColor="#ff0000"
              colors={['#ff0000', '#00ff00', '#0000ff']}
              progressBackgroundColor="#ffff00"
            />
          }
        >
          {this.renderViewPager()}
          {this.renderCardList()}
        </ScrollView>
      </View>
    );
  }
}
