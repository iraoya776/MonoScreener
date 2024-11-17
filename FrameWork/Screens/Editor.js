import React, {
  useState,
  useRef,
  useCallback,
  useEffect,
  useContext,
} from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Text,
  ScrollView,
  SafeAreaView,
  Platform,
  StatusBar,
  Image,
  Alert,
  Dimensions,
} from 'react-native';
import Svg, {Path, Rect} from 'react-native-svg';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import RNFetchBlob from 'rn-fetch-blob';
import LeftArrowIcon from '../Components/ArrowBack';
import ImagePicker from 'react-native-image-crop-picker';
import {Themes} from '../Components/Themes';
import {useLocation, useNavigate} from 'react-router-native';
import {supabase} from '../Supabase/supabase';
import {RootSiblingParent} from 'react-native-root-siblings';
import Toast from 'react-native-root-toast';
import {AppContext} from '../Components/GlobalVariables';

const IconSvg = ({name, size = 20, color = Themes.colors.darkGray}) => {
  const icons = {
    bold: (
      <Path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" />
    ),
    italic: <Path d="M19 4h-9M14 20H5M15 4L9 20" />,
    underline: <Path d="M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3M4 21h16" />,
    clear: <Path d="M18 6L6 18M6 6l12 12" />,
    fontSizeIncrease: <Path d="M8 3v18M2 9h12M14 3h7M14 21h7M17 3v18" />,
    fontSizeDecrease: <Path d="M8 3v18M2 9h12M14 3h7M14 21h7" />,
    edit: (
      <Path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    ),
    eye: (
      <Path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" />
    ),
    comments: (
      <Path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    ),
    upload: (
      <Path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4 M17 8l-5-5-5 5 M12 3v12" />
    ),
    split: <Path d="M21 3H3M21 7H3M21 11H3M21 15H3M21 19H3" />,
    trash: (
      <Path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2 M10 11v6 M14 11v6" />
    ),
  };

  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round">
      {icons[name]}
    </Svg>
  );
};

const SendRequestIcon = () => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke={Themes.colors.white} // You can adjust the stroke color
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round">
    <Path d="M22 2L11 13" />
    <Path d="M22 2L15 22L11 13L2 9L22 2Z" />
  </Svg>
);

const JoinCallIcon = () => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke={Themes.colors.darkGray} // You can adjust the stroke color
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round">
    {/* Phone shape */}
    <Path d="M22 16.92V21a2 2 0 0 1-2.18 2A19.89 19.89 0 0 1 3 5.18 2 2 0 0 1 5 3h4.08a2 2 0 0 1 2 1.72 13.53 13.53 0 0 0 .66 2.87 2 2 0 0 1-.45 2.11L9.91 11.91a16 16 0 0 0 6.09 6.09l1.21-1.37a2 2 0 0 1 2.11-.45 13.53 13.53 0 0 0 2.87.66 2 2 0 0 1 1.71 2z" />

    {/* Camera icon */}
    <Rect x="12" y="3" width="10" height="6" rx="2" ry="2" />
    <Path d="M22 3v6l-3-3l-3 3V3h6Z" />
  </Svg>
);

const AdvancedTextEditor = () => {
  const {preloader, setPreloader, userUID} = useContext(AppContext);

  const location = useLocation();
  const {
    projectTitle,
    projectDescription,
    creators_id,
    textContent,
    created_at,
    comments_length,
    creators,
    creators_avatar,
    project_id,
    creator_id,
  } = location.state || {};

  // console.log(creators_id.includes(userUID));
  const navigate = useNavigate();

  const [content, setContent] = useState([{type: 'text', value: ''}]);
  const [selection, setSelection] = useState({start: 0, end: 0});
  const [formattedRanges, setFormattedRanges] = useState([]);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const inputRef = useRef(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const scrollViewRef = useRef(null);

  const togglePreviewMode = () => {
    setIsPreviewMode(!isPreviewMode);
    setTimeout(() => {
      scrollViewRef.current?.scrollTo({y: scrollPosition, animated: false});
    }, 0);
  };

  const applyFormat = useCallback(
    format => {
      if (selection.start !== selection.end) {
        const existingFormat = formattedRanges.find(
          range =>
            range.format === format &&
            range.start === selection.start &&
            range.end === selection.end,
        );

        if (existingFormat) {
          setFormattedRanges(
            formattedRanges.filter(range => range !== existingFormat),
          );
        } else {
          setFormattedRanges([
            ...formattedRanges,
            {format, start: selection.start, end: selection.end},
          ]);
        }
      }
    },
    [selection, formattedRanges],
  );

  const renderFormattedText = text => {
    let lastIndex = 0;
    const parts = [];
    const sortedRanges = [...formattedRanges].sort((a, b) => a.start - b.start);

    sortedRanges.forEach(({format, start, end}) => {
      if (start > lastIndex) {
        parts.push(text.slice(lastIndex, start));
      }

      parts.push(
        <Text key={`formatted-${start}`} style={getStyleForFormat(format)}>
          {text.slice(start, end)}
        </Text>,
      );

      lastIndex = end;
    });

    if (lastIndex < text.length) {
      parts.push(text.slice(lastIndex));
    }

    return <Text style={[styles.previewText, {fontSize}]}>{parts}</Text>;
  };

  const getStyleForFormat = format => {
    switch (format) {
      case 'bold':
        return {fontWeight: 'bold'};
      case 'italic':
        return {fontStyle: 'italic'};
      case 'underline':
        return {textDecorationLine: 'underline'};
      default:
        return {};
    }
  };

  const width = Dimensions.get('screen').width;

  const generatePDF = async () => {
    try {
      let htmlContent = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <title>Editable Document</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 0; padding: 0px; }
              img { max-width: ${width}; height: auto; }
              .editable { border: 1px solid #ccc; padding: 5px; margin-bottom: 5px; }
            </style>
          </head>
          <body>
      `;

      content.forEach((item, index) => {
        if (item.type === 'text') {
          let formattedText = item.value;

          formattedRanges.forEach(({format, start, end}) => {
            let before = formattedText.slice(0, start);
            let middle = formattedText.slice(start, end);
            let after = formattedText.slice(end);

            switch (format) {
              case 'bold':
                middle = `<strong>${middle}</strong>`;
                break;
              case 'italic':
                middle = `<em>${middle}</em>`;
                break;
              case 'underline':
                middle = `<u>${middle}</u>`;
                break;
            }
            formattedText = before + middle + after;
          });

          htmlContent += `<div class="editable" contenteditable="true" style="font-size: ${fontSize}px;">${formattedText}</div>`;
        } else if (item.type === 'image') {
          htmlContent += `<img src="${item.uri}" style="max-width: ${width} height: auto;"/>`;
        }
      });

      htmlContent += `
          <script>
            document.designMode = 'on';
          </script>
        </body>
      </html>`;

      const options = {
        html: htmlContent,
        fileName: 'editable_document',
        directory: 'Documents',
      };

      const file = await RNHTMLtoPDF.convert(options);

      const filePath = file.filePath;
      const newFilePath = `${
        RNFetchBlob.fs.dirs.DownloadDir
      }/editable_document_${Date.now()}.pdf`;

      await RNFetchBlob.fs.cp(filePath, newFilePath);

      Alert.alert('Success', `Editable PDF saved to ${newFilePath}`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      Alert.alert(
        'Error',
        'Failed to generate editable PDF. Please try again.',
      );
    }
  };

  const renderToolbarButton = (icon, format) => (
    <TouchableOpacity style={styles.button} onPress={() => applyFormat(format)}>
      <IconSvg name={icon} size={20} color={Themes.colors.darkGray} />
    </TouchableOpacity>
  );

  const clearFormatting = () => {
    setFormattedRanges([]);
  };

  const handleContentChange = (index, newValue) => {
    const newContent = [...content];
    newContent[index] = {...newContent[index], value: newValue};
    setContent(newContent);
  };

  const changeFontSize = increment => {
    setFontSize(prevSize => Math.max(8, Math.min(prevSize + increment, 36)));
  };

  const deleteImage = index => {
    const newContent = content.filter((_, i) => i !== index);
    setContent(newContent);
  };

  const [commentList, setCommentList] = useState([]);
  const [commentCount, setCommentCount] = useState(0);

  useEffect(() => {
    fetchComments();

    // Subscribe to real-time updates
    const channel = supabase
      .channel('realtime-comments')
      .on(
        'postgres_changes',
        {event: '*', schema: 'public', table: 'comments'},
        payload => {
          const newComment = payload.new;

          // Update the comment list
          setCommentList(prevComments => {
            const exists = prevComments.some(
              comment => comment.id === newComment.id,
            );

            if (!exists) {
              // Prepend the new comment if it's not already in the list
              const updatedComments = [newComment, ...prevComments];
              const newCount = updatedComments.length;

              // Show toast only if the count has increased
              if (newCount > commentCount) {
                Toast.show(
                  `${newComment.creator} added ${newComment.message}`,
                  {
                    duration: Toast.durations.LONG,
                    position: Toast.positions.BOTTOM,
                    shadow: true,
                    animation: true,
                    hideOnPress: true,
                    delay: 0,
                    textColor: Themes.colors.darkGray,
                    backgroundColor: Themes.colors.backgroundColor,
                    shadowColor: '#333',
                    containerStyle: [
                      {
                        height: 'auto',
                        marginBottom: 30,
                        padding: 10,
                        borderRadius: 10,
                      },
                    ],
                  },
                );

                setCommentCount(newCount); // Update the comment count
              }

              return updatedComments;
            }
            return prevComments; // Return the existing list if the comment is already there
          });
        },
      )
      .subscribe();

    // Cleanup subscription on component unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, [commentCount]);

  async function fetchComments() {
    const {data, error} = await supabase
      .from('comments')
      .select('*')
      .order('created_at', {ascending: false})
      .eq(`doc_id`, created_at);

    if (error) {
      console.error(error);
    } else {
      setCommentList(data);
      setCommentCount(data.length); // Set the initial comment count
    }
  }

  return (
    <RootSiblingParent>
      <View style={styles.container}>
        <View style={styles.firstView}>
          <View
            style={{flexDirection: 'row', alignItems: 'center', columnGap: 10}}>
            <TouchableOpacity onPress={() => navigate(-1)}>
              <LeftArrowIcon size={30} color={Themes.colors.white} />
            </TouchableOpacity>
            <Text style={styles.firstText}>Editor</Text>
          </View>
        </View>
        <ScrollView
          style={styles.editorContainer}
          ref={scrollViewRef}
          onScroll={event =>
            setScrollPosition(event.nativeEvent.contentOffset.y)
          }
          scrollEventThrottle={16}>
          {content.map((item, index) => (
            <View key={index}>
              {item.type === 'image' && (
                <View style={styles.imageContainer}>
                  <Image
                    source={{uri: item.uri}}
                    style={[styles.image, {width}]}
                    resizeMode="cover"
                  />
                  <TouchableOpacity
                    style={styles.deleteImageButton}
                    onPress={() => deleteImage(index)}>
                    <IconSvg name="trash" size={24} color="red" />
                  </TouchableOpacity>
                </View>
              )}
              {item.type === 'text' &&
                (isPreviewMode ? (
                  renderFormattedText(item.value)
                ) : (
                  <TextInput
                    ref={inputRef}
                    style={[styles.textInput, {fontSize}]}
                    multiline
                    value={item.value}
                    onChangeText={newValue =>
                      handleContentChange(index, newValue)
                    }
                    onSelectionChange={event =>
                      setSelection(event.nativeEvent.selection)
                    }
                    placeholder="Start typing here..."
                  />
                ))}
            </View>
          ))}
        </ScrollView>
        <View style={styles.toolbar}>
          <ScrollView horizontal>
            {renderToolbarButton('bold', 'bold')}
            {renderToolbarButton('italic', 'italic')}
            {renderToolbarButton('underline', 'underline')}
            <TouchableOpacity style={styles.button} onPress={clearFormatting}>
              <IconSvg name="clear" size={20} color={Themes.colors.darkGray} />
            </TouchableOpacity>

            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <TouchableOpacity
                style={[styles.button, {marginRight: 0}]}
                onPress={() => changeFontSize(1)}>
                <IconSvg
                  name="fontSizeIncrease"
                  size={20}
                  color={Themes.colors.darkGray}
                />
              </TouchableOpacity>
              <Text style={{textAlign: 'center', marginHorizontal: 5}}>
                {fontSize}
              </Text>
              <TouchableOpacity
                style={styles.button}
                onPress={() => changeFontSize(-1)}>
                <IconSvg
                  name="fontSizeDecrease"
                  size={20}
                  color={Themes.colors.darkGray}
                />
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={styles.button}
              onPress={() => setIsPreviewMode(!isPreviewMode)}>
              <IconSvg
                name={isPreviewMode ? 'edit' : 'eye'}
                size={20}
                color={Themes.colors.darkGray}
              />
            </TouchableOpacity>
          </ScrollView>
        </View>
        <View style={styles.actionBar}>
          {/* <TouchableOpacity>
            <View>
              <JoinCallIcon />
              <Text style={styles.actionText}>Join</Text>
            </View>
          </TouchableOpacity> */}

          <TouchableOpacity style={styles.actionButton} onPress={generatePDF}>
            <IconSvg name="upload" size={30} color={Themes.colors.darkGray} />
            <Text style={styles.actionText}>Publish</Text>
          </TouchableOpacity>
          {/* <TouchableOpacity style={styles.actionButton}>
            <IconSvg name="split" size={30} color={Themes.colors.darkGray} />
            <Text style={styles.actionText}>Split</Text>
          </TouchableOpacity> */}
        </View>
      </View>
    </RootSiblingParent>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  firstView: {
    backgroundColor: Themes.colors.red,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  firstText: {
    fontSize: 20,
    color: Themes.colors.white,
    fontFamily: Themes.fonts.regular,
  },
  commentContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    //columnGap: 5,
  },
  toolbar: {
    marginTop: Platform.OS === 'android' ? 10 : 0,
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  button: {
    padding: 10,
    marginRight: 10,
    backgroundColor: '#f0f4f8',
    borderRadius: 8,
  },
  indentText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  editorContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    margin: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  textInput: {
    padding: 10,
    color: '#333',
  },
  previewText: {
    color: '#333',
    padding: 10,
  },
  imageContainer: {
    position: 'relative',
    marginVertical: 10,
  },
  image: {
    //width: '100%',
    height: 200,
    borderRadius: 20,
  },
  deleteImageButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    padding: 8,
  },
  actionBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  actionButton: {
    alignItems: 'center',
  },
  actionText: {
    marginTop: 5,
    fontSize: 12,
    color: Themes.colors.textColor,
    fontFamily: Themes.fonts.regular,
  },
  commentLength: {
    fontSize: 25,
    color: Themes.colors.red,
    fontFamily: Themes.fonts.semiBold,
  },
});

export default AdvancedTextEditor;
