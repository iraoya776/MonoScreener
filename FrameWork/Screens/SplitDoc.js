import React, { useState, useRef, useEffect, useContext } from "react";
import {
  SafeAreaView,
  View,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TouchableOpacity,
  Text,
  ScrollView,
  Keyboard,
  StatusBar,
  Image,
} from "react-native";
import { RichText, Toolbar, useEditorBridge } from "@10play/tentap-editor";
import { DEFAULT_TOOLBAR_ITEMS } from "@10play/tentap-editor";
import {
  AntDesign,
  Entypo,
  Foundation,
  MaterialIcons,
  Ionicons,
} from "@expo/vector-icons";
import * as Print from "expo-print";
import { shareAsync } from "expo-sharing";
import { AppContext } from "../Components/GlobalVariables";
import { LinearGradient } from "expo-linear-gradient";
import { Themes } from "../Components/Themes";
import * as ImagePicker from "expo-image-picker";

export const SplitDoc = () => {
  const { userInfo } = useContext(AppContext);
  const [editorContent, setEditorContent] = useState(
    "<div>What are you working on?</div>"
  );
  const scrollViewRef = useRef(null);
  const [contentHeight, setContentHeight] = useState(0);

  const editor = useEditorBridge({
    autofocus: true,
    avoidIosKeyboard: true,
    initialContent: editorContent,
    onChange: (html) => {
      setEditorContent(html);
      setContentHeight((prevHeight) => prevHeight + 1);
    },
  });

  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [contentHeight]);

  const [image, setImage] = useState(null)

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri)
    }
  };

  const printToPdf = async () => {
    const topicText =
      "Consequences of drug use in Nigeria: A case study of the University of Lagos";
    const html = `
      <html>
      <heading>
      </heading>
        <body>
          <h1>${editorContent}</h1>
          <h2>Topic</h2>
          <img src=${image} />
          <p>${topicText}</p>
        </body>
      </html>
    `;

    try {
      const { uri } = await Print.printToFileAsync({ html });
      await shareAsync(uri, { UTI: ".pdf", mimeType: "application/pdf" });
    } catch (error) {
      console.error("Error printing to PDF:", error);
    }
  };

  return (
    <View style={styles.container}>
      {/* </View><StatusBar barStyle="light-content" /> */}
      <LinearGradient
        colors={[Themes.colors.red, Themes.colors.red]}
        style={styles.header}
      >
        <Ionicons name="arrow-back" size={30} color={Themes.colors.white} />
        <Text style={styles.headerTitle}>Editor</Text>
      </LinearGradient>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 10}
      >
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.topicContainer}>
            <Text style={styles.topicText}>
              Consequences of drug use in Nigeria: A case study of the
              University of Lagos
            </Text>
          </View>
          <View style={styles.editorContainer}>
            <RichText
              editor={editor}
              style={styles.richText}
              onContentSizeChange={(event) => {
                setContentHeight(event.nativeEvent.contentSize.height);
              }}
            />
          </View>
        </ScrollView>
        <View style={styles.actionBar}>
          <View style={styles.userInfo}>
            <Image
              source={{ uri: userInfo.avatar_url }}
              style={styles.avatar}
            />
            <Text style={styles.userName}>{userInfo.full_name}</Text>
          </View>
          <View style={styles.iconContainer}>
            <TouchableOpacity style={styles.iconButton}>
              <Entypo name="image" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            {/* <TouchableOpacity style={styles.iconButton}>
              <Ionicons name="enter-outline" size={24} color="#FFFFFF" />
            </TouchableOpacity> */}
            <TouchableOpacity style={styles.iconButton}>
              <Foundation name="comments" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            {/* <TouchableOpacity style={styles.iconButton}>
              <MaterialIcons name="difference" size={24} color="#FFFFFF" />
            </TouchableOpacity> */}
            <TouchableOpacity style={styles.iconButton} onPress={printToPdf}>
              <AntDesign name="pdffile1" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
        <Toolbar
          items={DEFAULT_TOOLBAR_ITEMS}
          editor={editor}
          style={[styles.toolbar]}
        />
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Themes.colors.backgroundColor,
    marginTop: Platform.OS === "android" ? StatusBar.currentHeight : null,
    //padding: 10,
  },
  header: {
    height: 60,
    flexDirection: "row",
    columnGap: 10,
    alignItems: "center",
    paddingLeft: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    marginTop: 5,
  },
  topicContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 15,
    marginBottom: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  topicText: {
    fontSize: 16,
    color: "#333",
    lineHeight: 24,
  },
  editorContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 20,
  },
  richText: {
    minHeight: 100,
    padding: 15,
  },
  actionBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: Themes.colors.red,
    paddingVertical: 10,
    paddingHorizontal: 20,
    //marginBottom: 100,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
  },
  userName: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  iconContainer: {
    flexDirection: "row",
  },
  iconButton: {
    marginLeft: 15,
  },
  toolbar: {
    backgroundColor: "#4a148c",
  },
});
