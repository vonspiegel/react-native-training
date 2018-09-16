import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Animated,
  Dimensions,
  StatusBar
} from "react-native";
import { Constants } from 'expo'
import { Screen, ViewLoading } from "../../App";
import { Header } from "react-native-elements";
import { Feather } from '@expo/vector-icons'
import * as api from "../Api";

const HEADER_HEIGHT = 180;
const AVATAR_SIZE = 84;
const { width } = Dimensions.get('window');

class ProfileScreen extends React.Component {
  scrollY = new Animated.Value(0);

  static navigationOptions = {
    title: "User",
    header: null,
  };

  state = {
    user: null,
    loading: true,
  };

  componentDidMount() {
    this.fetchUser();
  }

  fetchUser = () => {
    const userId = this.props.navigation.getParam("userId");
    if (userId) {
      this.props.api
        .fetchUser({ userId })
        .then(user => this.setState({ loading: false, user }));
    } else {
      this.setState({ error: "no user available. please go back" });
    }
  };

  render() {

    const showBack = this.props.navigation.getParam("noBack");
    const { scrollY } = this;

    let opacity = scrollY.interpolate({
      inputRange: [0, 60, 100],
      outputRange: [0, 0, 1]
    });

    return (
      <Screen>
        {this.state.loading ? (
          <ViewLoading />
        ) : (
          <Animated.ScrollView
            scrollEventThrottle={1}
            contentContainerStyle={{paddingTop: -64}}
            onScroll={Animated.event([
              {
                nativeEvent: {
                  contentOffset: {
                    y: this.scrollY
                  }
                }
              }
            ])}
          >
            <View style={[styles.header]}>
              <Animated.Image
                resizeMode="cover"
                style={[styles.headerCover]}
                source={{ uri: this.state.user.profile_banner_url }}
              />
              <Image
                style={[
                  styles.headerAvatar,
                  {
                    borderColor: `#${this.state.user.profile_background_color}`
                  }
                ]}
                source={{ uri: this.state.user.profile_image_url_https }}
              />
            </View>
            <View style={styles.content}>
              <Text>{JSON.stringify(this.state.user, null, 4)}</Text>
            </View>
          </Animated.ScrollView>
        )}
        <Animated.View style={{
          opacity,
          position: 'absolute',
          top: 0,
          width
        }}>
        <Header
          outerContainerStyles={{
            paddingTop: Constants.statusBarHeight,
            borderBottomColor: 'transparent',
            paddingBottom: 8,
            height: 64
          }}
          leftComponent={!showBack ? <Feather onPress={() => this.props.navigation.goBack()} name="arrow-left" size={24} color="white" /> : null}
          centerComponent={{ text: "User", style: { color: "#fff", fontWeight: '800', fontSize: 18 } }}
          backgroundColor="#73CFEF"
        />
        <StatusBar barStyle="light-content" />
        </Animated.View>
      </Screen>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    height: HEADER_HEIGHT,
    backgroundColor: "red",
    marginBottom: 16
  },
  headerCover: {
    height: HEADER_HEIGHT,
    flex: 1
  },
  headerAvatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    backgroundColor: "grey",
    position: "absolute",
    bottom: (AVATAR_SIZE / 2) * -1,
    left: 16,
    borderWidth: 4
  },
  headerContent: {},
  content: {
    padding: 16
  }
});

ProfileScreen.defaultProps = {
  api
};

export default ProfileScreen;