// import { useField, useFormikContext } from "formik";
// import { Editor } from "@tinymce/tinymce-react";
// import { Box, Button, MenuItem, Select } from "@mui/material";
// import { useRef, useState } from "react";
// import { getDocumentUrl } from "../../features/common";
// import { useAuth } from "../../hooks";

// type TemplateOption = {
//   label: string;
//   content: string;
// };

// // ⬇️ TOP OF FILE
// const templates: TemplateOption[] = [
//   {
//     label: "የስራ እቅድ መስጠት",
//     content: `
// <h2 style="text-align:center;">የስራ እቅድ መስጠት</h2>

// <p><strong>ቁጥር፡</strong> ----------------/2017 ዓ/ም</p>
// <p><strong>ቀን፡</strong> ---------------- ዓ/ም</p>

// <p><strong>ለአቶ ______ ______</strong><br/>
// የፍ/ዳ/አ/አሰ/ዋ/የስ/ሂደት ዳኛ</p>

// <p><strong>ጉዳዩ፡</strong> የስራ አፈፃፀም ምዘና እቅድ መስጠትን ይመለከታል</p>

// <p>እርሶ በክልሉ ምክር ቤት የከፍ/ፍ/ቤት ዳኛ መሆንዎ እና በቁጥር ከፍ/ፕ/ፅ/336/2017 ዓ/ም ቀን 21/06/2017 ዓ/ም 
// የፍታብሄር የስራ ሂደት ዳኛ ሆኖ ተመድበዋል፡፡</p>

// <p>ስለዚህ፣ ከዚያ ቀን ጀምሮ እስከ ሰኔ 30 ቀን 2017 ዓ/ም ድረስ የሚያካትተው 2 ገፅ የስራ አፈፃፀም እቅድ ተሰጥቷል፡፡</p>

// <p style="margin-top:2em;">//ከሰላምታ ጋር//</p>

// <hr/>

// <p><strong>ግልባጭ፡</strong></p>
// <ul>
//   <li>ለአብክመ ጠ/ፍ/ቤት - ባህር ዳር</li>
//   <li>ለዳ/አስ/ን/ጉ/ፅ/ቤት - ከፍ/ፍ/ቤት</li>
// </ul>
//     `,
//   },
//   {
//     label: "እቅድ ማሳወቅ እና ትእዛዝ",
//     content: `
// <h2 style="text-align:center;">እቅድ ማሳወቅ እና ትእዛዝ</h2>

// <p><strong>ቁጥር፡</strong> ከፍ/ፕ/ፅ/337/2017 ዓ/ም</p>
// <p><strong>ቀን፡</strong> 21/06/2017 ዓ/ም</p>

// <p><strong>ለአቶ ______ ______</strong><br/>
// የወ/ዳ/አ/አሰ/ዋ/የስ/ሂ አስተባባሪ እና ዳኛ</p>

// <p><strong>ጉዳዩ፡</strong> እቅድ መስጠትን ስለማሳወቅ</p>

// <p>እርሶ ከ19/6/2017 ዓ/ም ጀምሮ የወንጀል ስራ ሂደት አስተባባሪ መሆናችሁ ታውቋል፡፡</p>

// <p>በዚህ መሠረት፣ 4 ገፅ የስራ እቅድ ከዚህ ደብዳቤ ጋር ተያይዞ ተላከላችሁ፡፡ በሂደቱ ላይ በትኩረት በማስተዳደር፣ እርስዎ በላቀ ውጤት ይሰሩ በሚል መልእክት እቀርባለሁ፡፡</p>

// <p>የሰዓት ቁጥጥርና የአገልግሎት አሰጣጥ በየ15 ቀኑ ተገቢውን ግምገማ እየተደረገ እንዲሁ በየወሩ ሂደቱ ይታየዋል፡፡</p>

// <p style="margin-top:2em;">//ከሰላምታ ጋር//</p>
//     `,
//   },
// ];


// interface Props {
//   name: string;
// }

// export const FormRichLetterTextField = ({ name }: Props) => {
//   const { setFieldValue } = useFormikContext();
//   const [field] = useField(name);
//   const editorRef = useRef<any>(null);
//   const [selectedTemplate, setSelectedTemplate] = useState("");
//   const { user } = useAuth();

//   const handleInsertContent = (html: string) => {
//     if (editorRef.current) {
//       editorRef.current.insertContent(html);
//     }
//   };

//   const handleTemplateChange = (templateLabel: string) => {
//     const template = templates.find((t) => t.label === templateLabel);
//     if (template) {
//       handleInsertContent(template.content);
//       setSelectedTemplate(templateLabel);
//     }
//   };

//   const handleInsertSignature = () => {
//     if (!user?.signatureId) {
//       alert("No signature found for this user.");
//       return;
//     }

//     const imgHtml = `<p><img src="${getDocumentUrl(user.signatureId)}" alt="Signature" style="width:180px; height:auto;" /></p>`;
//     handleInsertContent(imgHtml);
//   };

//   return (
//     <Box>
//       <Box sx={{ mb: 2, display: "flex", gap: 2, flexWrap: "wrap" }}>
//         <Select
//           size="small"
//           value={selectedTemplate}
//           displayEmpty
//           onChange={(e) => handleTemplateChange(e.target.value)}
//         >
//           <MenuItem value="" disabled>
//             Insert Template
//           </MenuItem>
//           {templates.map((t) => (
//             <MenuItem key={t.label} value={t.label}>
//               {t.label}
//             </MenuItem>
//           ))}
//         </Select>

//         <Button variant="outlined" size="small" onClick={handleInsertSignature}>
//           Insert Signature
//         </Button>
//       </Box>

//       <Editor
//         apiKey="mb9nytfiqqu0o92su6xttcmxb8nme0f74u7z8lpwco52ilga"
//         onInit={(_: any, editor: any) => (editorRef.current = editor)}
//         value={field.value || ""}
//         onEditorChange={(content: any) => setFieldValue(name, content)}
//         init={{
//           height: 700,
//           menubar: true,
//           plugins:
//             "print preview pagebreak code fullscreen searchreplace autolink autosave save directionality visualblocks visualchars image link media table charmap hr anchor insertdatetime advlist lists wordcount",
//           toolbar:
//             "undo redo | formatselect | bold italic underline | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | pagebreak | image link | code preview print",
//           content_style: `
//             body {
//               font-family: Helvetica, Arial, sans-serif;
//               font-size: 14px;
//               margin: 40px;
//             }
//             .page-break {
//               display: block;
//               height: 0;
//               page-break-after: always;
//             }
//           `,
//           placeholder: "Start typing your letter...",
//         }}
//       />
//     </Box>
//   );
// };



import { useField, useFormikContext } from "formik";
import { Editor } from "@tinymce/tinymce-react";
import { Box, Button, MenuItem, Select } from "@mui/material";
import { useRef, useState } from "react";
import { getDocumentUrl } from "../../features/common";
import { useAuth } from "../../hooks";

type TemplateOption = {
  label: string;
  content: string;
};

// ⬇️ TOP OF FILE
const templates: TemplateOption[] = [
  {
    label: "የስራ እቅድ መስጠት",
    content: `
<h2 style="text-align:center;">የስራ እቅድ መስጠት</h2>

<p><strong>ቁጥር፡</strong> ----------------/2017 ዓ/ም</p>
<p><strong>ቀን፡</strong> ---------------- ዓ/ም</p>

<p><strong>ለአቶ ______ ______</strong><br/>
የፍ/ዳ/አ/አሰ/ዋ/የስ/ሂደት ዳኛ</p>

<p><strong>ጉዳዩ፡</strong> የስራ አፈፃፀም ምዘና እቅድ መስጠትን ይመለከታል</p>

<p>እርሶ በክልሉ ምክር ቤት የከፍ/ፍ/ቤት ዳኛ መሆንዎ እና በቁጥር ከፍ/ፕ/ፅ/336/2017 ዓ/ም ቀን 21/06/2017 ዓ/ም 
የፍታብሄር የስራ ሂደት ዳኛ ሆኖ ተመድበዋል፡፡</p>

<p>ስለዚህ፣ ከዚያ ቀን ጀምሮ እስከ ሰኔ 30 ቀን 2017 ዓ/ም ድረስ የሚያካትተው 2 ገፅ የስራ አፈፃፀም እቅድ ተሰጥቷል፡፡</p>

<p style="margin-top:2em;">//ከሰላምታ ጋር//</p>

<hr/>

<p><strong>ግልባጭ፡</strong></p>
<ul>
  <li>ለአብክመ ጠ/ፍ/ቤት - ባህር ዳር</li>
  <li>ለዳ/አስ/ን/ጉ/ፅ/ቤት - ከፍ/ፍ/ቤት</li>
</ul>
    `,
  },
  {
    label: "እቅድ ማሳወቅ እና ትእዛዝ",
    content: `
<h2 style="text-align:center;">እቅድ ማሳወቅ እና ትእዛዝ</h2>

<p><strong>ቁጥር፡</strong> ከፍ/ፕ/ፅ/337/2017 ዓ/ም</p>
<p><strong>ቀን፡</strong> 21/06/2017 ዓ/ም</p>

<p><strong>ለአቶ ______ ______</strong><br/>
የወ/ዳ/አ/አሰ/ዋ/የስ/ሂ አስተባባሪ እና ዳኛ</p>

<p><strong>ጉዳዩ፡</strong> እቅድ መስጠትን ስለማሳወቅ</p>

<p>እርሶ ከ19/6/2017 ዓ/ም ጀምሮ የወንጀል ስራ ሂደት አስተባባሪ መሆናችሁ ታውቋል፡፡</p>

<p>በዚህ መሠረት፣ 4 ገፅ የስራ እቅድ ከዚህ ደብዳቤ ጋር ተያይዞ ተላከላችሁ፡፡ በሂደቱ ላይ በትኩረት በማስተዳደር፣ እርስዎ በላቀ ውጤት ይሰሩ በሚል መልእክት እቀርባለሁ፡፡</p>

<p>የሰዓት ቁጥጥርና የአገልግሎት አሰጣጥ በየ15 ቀኑ ተገቢውን ግምገማ እየተደረገ እንዲሁ በየወሩ ሂደቱ ይታየዋል፡፡</p>

<p style="margin-top:2em;">//ከሰላምታ ጋር//</p>
    `,
  },
];


interface Props {
  name: string;
}

export const FormRichLetterTextField = ({ name }: Props) => {
  const { setFieldValue } = useFormikContext();
  const [field] = useField(name);
  const editorRef = useRef<any>(null);
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const { user } = useAuth();

  const handleInsertContent = (html: string) => {
    if (editorRef.current) {
      editorRef.current.insertContent(html);
    }
  };

  const handleTemplateChange = (templateLabel: string) => {
    const template = templates.find((t) => t.label === templateLabel);
    if (template) {
      handleInsertContent(template.content);
      setSelectedTemplate(templateLabel);
    }
  };

  const handleInsertSignature = () => {
    if (!user?.signatureId) {
      alert("No signature found for this user.");
      return;
    }

    const imgHtml = `<p><img src="${getDocumentUrl(user.signatureId)}" alt="Signature" style="width:180px; height:auto;" /></p>`;
    handleInsertContent(imgHtml);
  };

  return (
    <Box>
      <Box sx={{ mb: 2, display: "flex", gap: 2, flexWrap: "wrap" }}>
        <Select
          size="small"
          value={selectedTemplate}
          displayEmpty
          onChange={(e) => handleTemplateChange(e.target.value)}
        >
          <MenuItem value="" disabled>
            Insert Template
          </MenuItem>
          {templates.map((t) => (
            <MenuItem key={t.label} value={t.label}>
              {t.label}
            </MenuItem>
          ))}
        </Select>

        <Button variant="outlined" size="small" onClick={handleInsertSignature}>
          Insert Signature
        </Button>
         <Button variant="outlined" size="small" onClick={handleInsertSignature}>
          Insert Blue Print
        </Button>
      </Box>

      <Editor
        apiKey="mb9nytfiqqu0o92su6xttcmxb8nme0f74u7z8lpwco52ilga"
        onInit={(_: any, editor: any) => (editorRef.current = editor)}
        value={field.value || ""}
        onEditorChange={(content: any) => setFieldValue(name, content)}
        init={{
          height: 700,
          menubar: true,
          plugins:
            "print preview pagebreak code fullscreen searchreplace autolink autosave save directionality visualblocks visualchars image link media table charmap hr anchor insertdatetime advlist lists wordcount",
          toolbar:
            "undo redo | formatselect | bold italic underline | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | pagebreak | image link | code preview print",
          content_style: `
            body {
              font-family: Helvetica, Arial, sans-serif;
              font-size: 14px;
              margin: 40px;
            }
            .page-break {
              display: block;
              height: 0;
              page-break-after: always;
            }
          `,
          placeholder: "Start typing your letter...",
        }}
      />
    </Box>
  );
};



