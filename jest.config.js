module.exports = {
  preset: "react-native",
  transformIgnorePatterns: [
    "node_modules/(?!(react-native|lottie-react-native|expo|react-native-maps|react-native-svg|react-native-branch|native-base-shoutem-theme|react-native-easy-grid|react-native-drawer|react-native-vector-icons|react-native-keyboard-aware-scroll-view|react-native-swiper|react-navigation|native-base|@expo|react-native-scrollable-tab-view|react-native-simple-modal|react-native-iphone-x-helper|react-native-camera)/)"
  ],
  setupFiles: ["<rootDir>/__mocks__/react-native-camera"]
};
