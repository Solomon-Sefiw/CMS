// import React, { useState } from 'react';
// import { 
//   EditorState, 
//   convertToRaw,
//   convertFromRaw,
//   ContentState,
//   RawDraftContentState
// } from 'draft-js';
// import { Editor } from 'react-draft-wysiwyg';
// import { 
//   Button,
//   Box
// } from '@mui/material';
// import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

// interface DocumentEditorProps {
//   initialContent?: string;
//   onSave: (plainText: string, jsonContent: string) => void;
//   onCancel: () => void;
//   readOnly?: boolean;
// }

// const DocumentEditor: React.FC<DocumentEditorProps> = ({ 
//   initialContent, 
//   onSave, 
//   onCancel,
//   readOnly = false
// }) => {
//   const [editorState, setEditorState] = useState<EditorState>(() => {
//     if (initialContent) {
//       try {
//         const content: RawDraftContentState = JSON.parse(initialContent);
//         return EditorState.createWithContent(convertFromRaw(content));
//       } catch (error) {
//         console.error('Failed to parse initial content:', error);
//         return EditorState.createWithContent(
//           ContentState.createFromText(initialContent)
//         );
//       }
//     }
//     return EditorState.createEmpty();
//   });

//   const handleSave = () => {
//     const content = convertToRaw(editorState.getCurrentContent());
//     const plainText = editorState.getCurrentContent().getPlainText();
//     onSave(plainText, JSON.stringify(content));
//   };

//   return (
//     <Box sx={{ 
//       display: 'flex', 
//       flexDirection: 'column', 
//       height: '500px',
//       backgroundColor: readOnly ? '#f5f5f5' : 'inherit'
//     }}>
//       <Editor
//         editorState={editorState}
//         onEditorStateChange={setEditorState}
//         readOnly={readOnly}
//         toolbar={{
//           options: ['inline', 'blockType', 'list', 'textAlign', 'link', 'image'],
//           image: {
//             uploadEnabled: !readOnly,
//             uploadCallback: (file: File) => {
//               return new Promise((resolve) => {
//                 resolve({ data: { link: URL.createObjectURL(file) } });
//               });
//             },
//             previewImage: true,
//             alt: { present: true, mandatory: false },
//             defaultSize: {
//               height: 'auto',
//               width: '100%',
//             },
//           },
//         }}
//         editorStyle={{
//           flex: 1,
//           border: '1px solid #ddd',
//           padding: '10px',
//           minHeight: '400px',
//           backgroundColor: readOnly ? '#f5f5f5' : 'white'
//         }}
//         wrapperStyle={{
//           flex: 1,
//           display: 'flex',
//           flexDirection: 'column'
//         }}
//       />
//       {!readOnly && (
//         <Box sx={{ 
//           display: 'flex', 
//           justifyContent: 'flex-end', 
//           mt: 2, 
//           gap: 1,
//           padding: '0 10px 10px 10px'
//         }}>
//           <Button 
//             variant="outlined" 
//             onClick={onCancel}
//             sx={{ minWidth: '100px' }}
//           >
//             Cancel
//           </Button>
//           <Button 
//             variant="contained" 
//             onClick={handleSave}
//             sx={{ minWidth: '100px' }}
//           >
//             Save
//           </Button>
//         </Box>
//       )}
//     </Box>
//   );
// };

// export default DocumentEditor;