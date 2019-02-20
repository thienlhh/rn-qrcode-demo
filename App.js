import React, { Component } from "react";
import {
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  BackHandler,
  Image,
  Dimensions,
  Alert
} from "react-native";
import {
  Container,
  Header,
  Body,
  Content,
  Button,
  Icon,
  Col
} from "native-base";
import { RNCamera } from "react-native-camera";

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      opened: false,
      data: null,
      image: null
    };

    this.landscapeMode = false;
  }

  componentDidMount() {
    BackHandler.addEventListener("hardwareBackPress", this.backHandler);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.backHandler);
  }

  // Handles hardware back button press. When the camera is opened then go back the home screen, otherwise close app
  backHandler = () => {
    if (this.state.opened) {
      this.toogleCamera();
      return true;
    }

    BackHandler.exitApp();
  };

  toogleCamera = () => {
    this.setState(prevState => {
      return {
        opened: !this.state.opened
      };
    });
  };

  openCamera = () => {
    this.toogleCamera();
  };

  _onBarCodeRead = qrcode => {
    if (this.landscapeMode) {
      this.toogleCamera();
      this.setState(prev => {
        return {
          data: qrcode.data
        };
      });
    }
  };

  takePicture = async camera => {
    if (this.landscapeMode) {
      const options = { quality: 0.5, base64: true };
      const data = await camera.takePictureAsync(options);

      this.toogleCamera();
      this.setState(prev => {
        return {
          image: data.uri
        };
      });
    }
  };

  // Checks if the phone is in landscape mode, if not then require use to turn the phone into landscape mode.
  // If not then disable camera functions
  checkOrientation = () => {
    const { width, height } = Dimensions.get("window");
    this.landscapeMode = width > height;

    if (!this.landscapeMode) {
      Alert.alert(
        "Landscape mode required",
        "Please turn your phone into landscape mode"
      );
    }
  };

  onCameraLayout = e => {
    this.checkOrientation();
  };

  renderCamera = () => {
    return (
      <View onLayout={this.onCameraLayout} style={styles.container}>
        <RNCamera
          style={styles.preview}
          type={RNCamera.Constants.Type.back}
          flashMode={RNCamera.Constants.FlashMode.auto}
          barCodeTypes={[RNCamera.Constants.BarCodeType.qr]}
          onBarCodeRead={this._onBarCodeRead}
          permissionDialogTitle={"Permission to use camera"}
          permissionDialogMessage={
            "We need your permission to use your camera phone"
          }
        >
          {({ camera, status, recordAudioPermissionStatus }) => {
            if (status !== "READY") return <View />;
            this.checkOrientation();

            return (
              <View style={styles.cameraContainer}>
                <TouchableOpacity
                  onPress={() => this.takePicture(camera)}
                  style={styles.capture}
                >
                  <Text style={{ fontSize: 14 }}> SNAP </Text>
                </TouchableOpacity>
              </View>
            );
          }}
        </RNCamera>
      </View>
    );
  };

  // Renders qrcode data or image taken by user. If there is no data or image, just show then dummy text
  renderComponents = () => {
    let dataComponent = <Text>No data</Text>;
    if (this.state.data) {
      dataComponent = <Text>{this.state.data}</Text>;
    } else if (this.state.image) {
      dataComponent = (
        <Image
          style={{ width: 300, height: 300 }}
          source={{ uri: this.state.image }}
        />
      );
    }
    return (
      <Col style={styles.componentContainer}>
        {dataComponent}
        <Button style={styles.cameraBtn} onPress={this.openCamera.bind(this)}>
          <Icon name="camera" />
        </Button>
      </Col>
    );
  };

  renderHeader = () => {
    // Hide the app header on camera openning
    return (
      !this.state.opened && (
        <Header noLeft>
          <Body>
            <Text style={styles.headerText}>QRCode Demo</Text>
          </Body>
        </Header>
      )
    );
  };

  render() {
    return (
      <Container>
        {this.renderHeader()}
        <Content contentContainerStyle={styles.container}>
          {this.state.opened ? this.renderCamera() : this.renderComponents()}
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center"
  },
  preview: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center"
  },
  capture: {
    flex: 0,
    backgroundColor: "#fff",
    borderRadius: 25,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: "center",
    margin: 20
  },
  cameraContainer: {
    flex: 0,
    flexDirection: "row",
    justifyContent: "center"
  },
  componentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  headerText: { fontSize: 18, color: "white", alignSelf: "center" },
  cameraBtn: { alignSelf: "center", marginTop: 20 }
});
