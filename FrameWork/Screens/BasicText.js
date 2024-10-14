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
  TextInput,
} from "react-native";
import {
  RichText,
  Toolbar,
  useEditorBridge,
  useEditorContent,
} from "@10play/tentap-editor";
import { DEFAULT_TOOLBAR_ITEMS } from "@10play/tentap-editor";
import * as ImagePicker from "expo-image-picker";
import { supabase } from "../Supabase/supabase"; // Ensure you import your supabase client
import { AppContext } from "../Components/GlobalVariables";
import { LinearGradient } from "expo-linear-gradient";
import { Themes } from "../Components/Themes";
import { useRoute } from "@react-navigation/native";

export const Basic = () => {
  const { userInfo, userUID, reload } = useContext(AppContext); // User info from context

  const {
    topic,
    description,
    contents,
    creator_id,
    updated_at,
    creator_avatar,
    creator,
  } = useRoute().params;

  // const [projects, setProjects] = useState([]);

  // useEffect(() => {
  //   async function getprojects() {
  //     const { data, error, status } = await supabase
  //       .from(`projects_info`)
  //       .select(
  //         `topic, description, content, updated_at, creator, creator_avatar, created_at`
  //       )
  //       .eq(`creator_id`, userUID);
  //     if (data) {
  //       setProjects(data);
  //     } else {
  //       console.log(error);
  //     }
  //   }
  //   getprojects();
  // }, [userUID, reload]);

  // const editorContent = `<div style="border: 1px solid #ccc; padding: 10px; margin-bottom: 10px;">
  //  ${projects.map((item) => {
  //    return item.content;
  //  })}
  //   </div>`;

  // const [image, setImage] = useState([]);
  // const [contentHeight, setContentHeight] = useState(0);
  // const scrollViewRef = useRef(null);

  // const [editorContents, setEditorContents] = useState([]);

  // const topicText =
  //   "Consequences of drug use in Nigeria: A case study of the University of Lagos";

  // // Tentap editor bridge initialization
  // const editor = useEditorBridge({
  //   autofocus: true,
  //   avoidIosKeyboard: true,
  //   initialContent: editorContent,
  //   onChange: (html) => {
  //     //editorContents(html); // Update the content with editor's text
  //     setContentHeight((prevHeight) => prevHeight + 1);
  //   },
  // });

  // const content = useEditorContent(editor, {
  //   type: "html",
  //   //debounceInterval: 2,
  // });

  // const pickImage = async () => {
  //   let result = await ImagePicker.launchImageLibraryAsync({
  //     mediaTypes: ImagePicker.MediaTypeOptions.Images,
  //     allowsEditing: true,
  //     aspect: [4, 3],
  //     quality: 1,
  //   });

  //   if (!result.canceled) {
  //     const imageUri = result.assets[0].uri;
  //     const imageHtml = `<img src="${imageUri}" style="max-width: 100%; height: auto; margin: 10px 0;" />`;
  //     uploadContent(imageHtml);
  //   }
  // };

  // // Save content (text and images) to Supabase
  // const uploadContent = async (val) => {
  //   const { data, error } = await supabase.from("projects_info").upsert({
  //     topic: topicText,
  //     content: content, // Save the combined content (text + images)
  //     creator_id: userUID,
  //     updated_at: new Date().toLocaleString(),
  //     creator_avatar: userInfo.avatar_url,
  //     creator: userInfo.full_name,
  //   });

  //   if (error) {
  //     console.log("Error uploading content:", error);
  //   } else {
  //     console.log("Content uploaded successfully:", data);
  //   }
  // };

  // useEffect(() => {
  //   if (scrollViewRef.current) {
  //     scrollViewRef.current.scrollToEnd({ animated: true });
  //   }
  // }, [contentHeight]);

  const [inpMessage, setInpMessage] = useState("");

  const getMessage = () => {
    if (inpMessage.length == 0) {
      return "What are your thoughts today?";
    } else {
      return inpMessage;
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[Themes.colors.red, Themes.colors.red]}
        style={[styles.header]}
      >
        <View
          style={{ flexDirection: "row", alignItems: "center", columnGap: 10 }}
        >
          <Text style={styles.headerTitle}>Editor</Text>
        </View>
        <TouchableOpacity style={styles.userInfo}>
          <Image source={{ uri: userInfo.avatar_url }} style={styles.avatar} />
          <Text style={styles.participants}>23</Text>
        </TouchableOpacity>
      </LinearGradient>

      <Text>{inpMessage}</Text>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 10}
      >
        <View style={styles.footer}>
          <View style={styles.input}>
            <TextInput
              placeholder="what are your thoughts today?"
              multiline={true}
              numberOfLines={5}
              autoCapitalize="sentences"
              autoCorrect={true}
              style={styles.textInput}
              onChangeText={(inp) => setInpMessage(inp)}
            ></TextInput>
            <Text style={styles.inputCounter}>1/700</Text>
          </View>

          <View style={[styles.actionBar]}>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionText}>Add Image</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionText}>Upload</Text>
            </TouchableOpacity>
          </View>

          {/* <Toolbar
          items={DEFAULT_TOOLBAR_ITEMS}
          editor={editor}
          style={[styles.toolbar]}
        /> */}
        </View>
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
  body: {
    flex: 1,
    backgroundColor: Themes.colors.backgroundColor,
    padding: 10,
  },
  textInput: {
    borderWidth: 1,
    borderColor: Themes.colors.borderColor,
    borderRadius: 10,
    padding: 10,
    height: 150,
    fontSize: 17,
    color: Themes.colors.textColor,
    backgroundColor: Themes.colors.backgroundColor,
    width: "100%",
  },
  input: {
    marginBottom: 10,
  },
  inputCounter: {
    fontSize: 15,
    color: Themes.colors.red,
    marginRight: 10,
    textAlign: "right",
    marginTop: 5,
  },
  header: {
    height: 60,
    flexDirection: "row",
    justifyContent: "space-between",
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
    position: "absolute",
    bottom: 0,
    width: "100%",
  },
  // scrollContent: {
  //   flexGrow: 1,
  //   paddingHorizontal: 20,
  //   marginTop: 5,
  // },
  // topicContainer: {
  //   backgroundColor: "#FFFFFF",
  //   borderRadius: 10,
  //   padding: 15,
  //   marginBottom: 5,
  //   shadowColor: "#000",
  //   shadowOffset: { width: 0, height: 2 },
  //   shadowOpacity: 0.1,
  //   shadowRadius: 4,
  //   elevation: 3,
  // },
  // topicText: {
  //   fontSize: 16,
  //   color: "#333",
  //   lineHeight: 24,
  // },
  // editorContainer: {
  //   flex: 1,
  //   backgroundColor: "#FFFFFF",
  //   borderRadius: 10,
  //   shadowColor: "#000",
  //   shadowOffset: { width: 0, height: 2 },
  //   shadowOpacity: 0.1,
  //   shadowRadius: 4,
  //   elevation: 3,
  //   marginBottom: 20,
  // },
  // richText: {
  //   minHeight: 100,
  //   padding: 15,
  // },
  // actionBar: {
  //   flexDirection: "row",
  //   justifyContent: "space-between",
  //   alignItems: "center",
  //   //backgroundColor: Themes.colors.red,
  //   paddingVertical: 10,
  //   paddingHorizontal: 20,
  //   //marginBottom: 100,
  //   position: "relative",
  // },
  // userInfo: {
  //   flexDirection: "row",
  //   alignItems: "flex-start",
  //   marginRight: 15,
  // },
  // avatar: {
  //   width: 50,
  //   height: 50,
  //   borderRadius: 25,
  //   borderWidth: 4,
  //   borderColor: Themes.colors.white,
  // },
  // participants: {
  //   color: Themes.colors.white,
  //   fontFamily: Themes.fonts.text800,
  // },
  // iconView: {
  //   position: "absolute",
  //   top: -30,
  //   flexDirection: "row",
  //   width: "100%",
  //   justifyContent: "space-between",
  //   left: 0,
  //   right: 0,
  // },
  // // liveText: {
  // //   color: Themes.colors.red,
  // //   fontSize: 16,
  // //   fontFamily: Themes.fonts.text600,
  // // },
  // // userName: {
  // //   color: "#FFFFFF",
  // //   fontWeight: "bold",
  // // },
  // // iconContainer: {
  // //   flexDirection: "row",
  // // },
  // iconButton: {
  //   alignSelf: "center",
  // },
  // toolbar: {
  //   backgroundColor: "#4a148c",
  // },
  // actionText: {
  //   fontFamily: Themes.fonts.text400,
  //   textAlign: "center",
  // },
});

{/* <View style={[styles.actionBar]}>
  <TouchableOpacity onPress={pickImage} style={styles.actionButton}>
    <Entypo
      name="image"
      size={28}
      color="#FF416C"
      style={styles.iconButton}
    />
    <Text style={styles.actionText}>Image</Text>
  </TouchableOpacity>
  <TouchableOpacity style={styles.actionButton}>
    <Foundation
      name="comments"
      size={28}
      color="#FF416C"
      style={styles.iconButton}
    />
    <Text style={styles.actionText}>Comment</Text>
  </TouchableOpacity>
  <TouchableOpacity style={styles.actionButton}>
    <Octicons
      name="upload"
      size={28}
      color="#FF416C"
      style={styles.iconButton}
    />
    <Text style={styles.actionText}>Upload</Text>
  </TouchableOpacity>
  <TouchableOpacity style={styles.actionButton}>
    <MaterialIcons
      name="difference"
      size={28}
      color="#FF416C"
      style={styles.iconButton}
    />
    <Text style={styles.actionText}>Split</Text>
  </TouchableOpacity>
  <TouchableOpacity onPress={printToPdf} style={styles.actionButton}>
    <AntDesign
      name="pdffile1"
      size={28}
      color="#FF416C"
      style={styles.iconButton}
    />
    <Text style={styles.actionText}>PDF</Text>
  </TouchableOpacity>
</View> */}
