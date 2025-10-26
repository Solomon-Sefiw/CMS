// src/components/form-controls/form-letter.tsx
import React, { useRef, useState, useEffect } from "react";
import { useField, useFormikContext } from "formik";
import { Editor } from "@tinymce/tinymce-react";
import { Box, Button, MenuItem, Select } from "@mui/material";
import { getDocumentUrl } from "../../features/common";
import { useAuth } from "../../hooks";
import logoPath from "../../assets/login.png";
type TemplateOption = {
  label: string;
  content: string;
};

// Your templates (body-only). Keep them short; header/footer are automatic.
const templates: TemplateOption[] = [
  {
    label: "የስራ እቅድ መስጠት",
    content: `
      <h2 style="text-align:center;">የስራ እቅድ መስጠት</h2>
      <p><strong>ቁጥር፡</strong> ----------------/2017 ዓ/ም</p>
      <p><strong>ቀን፡</strong> ---------------- ዓ/ም</p>
      <p><strong>ለአቶ ______ ______</strong><br/>የፍ/ዳ/አ/አሰ/ዋ/የስ/ሂደት ዳኛ</p>
      <p><strong>ጉዳዩ፡</strong> የስራ አፈፃፀም ምዘና እቅድ መስጠትን ይመለከታል</p>
    `,
  },
  {
    label: "እቅድ ማሳወቅ እና ትእዛዝ",
    content: `
      <h2 style="text-align:center;">እቅድ ማሳወቅ እና ትእዛዝ</h2>
      <p><strong>ቁጥር፡</strong> ከፍ/ፕ/ፅ/337/2017 ዓ/ም</p>
      <p><strong>ቀን፡</strong> 21/06/2017 ዓ/ም</p>
      <p>እቅድ ከዚህ ጋር ተያይዞ ተላከ።</p>
    `,
  },
];

// The Amharic main content you provided — preloaded as default body.
const DEFAULT_AMHARIC_BODY = `
<p>የህግ የበላይነት በአንድ ሀገር፣ ሀገር ወይም ማህበረሰብ ውስጥ ያሉ ሁሉም ሰዎች እና ተቋማት ለአንድ ህግ ህግ አውጪዎች፣ የመንግስት ባለስልጣናት እና ዳኞች ተጠያቂ የሚሆኑበት ፖለቲካዊ እና ህጋዊ ሃሳብ ነው። አንዳንዴ በቀላሉ "ማንም ከህግ በላይ አይደለም" ወይም "ሁሉም በህግ ፊት እኩል ናቸው" ተብሎ ይገለጻል።  "የዜጎችን በህግ ፊት እኩልነት የሚደግፍ፣ የዘፈቀደ የመንግስት አሰራርን የሚያረጋግጥ እና በአጠቃላይ በዘፈቀደ የስልጣን አጠቃቀምን የሚከለክለው ዘዴ፣ ሂደት፣ ተቋም፣ አሰራር ወይም መደበኛ አሰራር" ነው። 
የህግ የበላይነት በአንድ ሀገር፣ ሀገር ወይም ማህበረሰብ ውስጥ ያሉ ሁሉም ሰዎች እና ተቋማት ለአንድ ህግ ህግ አውጪዎች፣ የመንግስት ባለስልጣናት እና ዳኞች ተጠያቂ የሚሆኑበት ፖለቲካዊ እና ህጋዊ ሃሳብ ነው። አንዳንዴ በቀላሉ "ማንም ከህግ በላይ አይደለም" ወይም "ሁሉም በህግ ፊት እኩል ናቸው" ተብሎ ይገለጻል።  "የዜጎችን በህግ ፊት እኩልነት የሚደግፍ፣ የዘፈቀደ የመንግስት አሰራርን የሚያረጋግጥ እና በአጠቃላይ በዘፈቀደ የስልጣን አጠቃቀምን የሚከለክለው ዘዴ፣ ሂደት፣ ተቋም፣ አሰራር ወይም መደበኛ አሰራር" ነው። የህግ የበላይነት በአንድ ሀገር፣ ሀገር ወይም ማህበረሰብ ውስጥ ያሉ ሁሉም ሰዎች እና ተቋማት ለአንድ ህግ ህግ አውጪዎች፣ የመንግስት ባለስልጣናት እና ዳኞች ተጠያቂ የሚሆኑበት ፖለቲካዊ እና ህጋዊ ሃሳብ ነው። አንዳንዴ በቀላሉ "ማንም ከህግ በላይ አይደለም" ወይም "ሁሉም በህግ ፊት እኩል ናቸው" ተብሎ ይገለጻል።  "የዜጎችን በህግ ፊት እኩልነት የሚደግፍ፣ የዘፈቀደ የመንግስት አሰራርን የሚያረጋግጥ እና በአጠቃላይ በዘፈቀደ የስልጣን አጠቃቀምን የሚከለክለው ዘዴ፣ ሂደት፣ ተቋም፣ አሰራር ወይም መደበኛ አሰራር" ነው። 
የህግ የበላይነት በአንድ ሀገር፣ ሀገር ወይም ማህበረሰብ ውስጥ ያሉ ሁሉም ሰዎች እና ተቋማት ለአንድ ህግ ህግ አውጪዎች፣ የመንግስት ባለስልጣናት እና ዳኞች ተጠያቂ የሚሆኑበት ፖለቲካዊ እና ህጋዊ ሃሳብ ነው። 
ከሰላምታ ጋር</p>
`;


interface Props {
  name: string;
  readOnly?: boolean;
}

export const FormRichLetterTextField: React.FC<Props> = ({ name, readOnly = false }) => {
  const { setFieldValue } = useFormikContext<any>();
  const [field] = useField(name);
  const editorRef = useRef<any>(null);
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const { user } = useAuth();



  // Non-editable header HTML
  const HEADER_HTML = `
    <div class="letter-header" contenteditable="false" style="
      display:flex;
      align-items:center;
      gap:16px;
      padding: 24px 40px 8px 40px;
      box-sizing: border-box;
    ">
      <div style="width:140px; flex: 0 0 140px;">
        <img src="${logoPath}" alt="North Shewa Logo" style="max-width:140px; height:auto; display:block;" />
      </div>
      <div style="flex:1; text-align:left;">
        <div style="font-family: 'Helvetica', Arial, sans-serif; font-size:20px; color:#0e4b4b; font-weight:700;">
          አማራ ክልል ከፍተኛ ፍርድ ቤት
        </div>
        <div style="font-size:13px; color:#0e4b4b; margin-top:4px;">
          AMHARA REGION HIGH COURT
        </div>
      </div>
      <div style="width:180px; text-align:right; font-size:12px; color:#6a6f6f;" contenteditable="false">
        <div>ቁጥር፡ __________</div>
        <div>ቀን፡ __________</div>
      </div>
    </div>
    <hr contenteditable="false" style="border:none; border-top:1px solid rgba(0,0,0,0.08); margin:0 40px 12px 40px;" />
  `;

  // Non-editable footer HTML (shows logo again on the left for brand consistency)
  const FOOTER_HTML = `
    <hr contenteditable="false" style="border:none; border-top:1px solid rgba(0,0,0,0.08); margin:24px 40px 8px 40px;" />
    <div class="letter-footer" contenteditable="false" style="
      padding: 12px 40px 40px 40px;
      display:flex;
      align-items:center;
      justify-content:space-between;
      font-family: Helvetica, Arial, sans-serif;
      font-size:12px;
      color:#0e4b4b;
    ">
      <div style="display:flex; align-items:center; gap:12px;">
        <div style="display:flex; align-items:center; gap:8px;">
          <img src="${logoPath}" alt="logo-small" style="height:28px; width:auto; display:block;"/>
        </div>
        <div>📞 (+251-58) 2 20 09 15</div>
        <div>✉️ asc@amhsc.gov.et</div>
        <div>🌐 amhsc.gov.et</div>
      </div>
      <div style="font-style:italic; opacity:0.9;">Upholding Justice with Integrity</div>
    </div>
  `;

  // Build full editor content from body-only HTML (no watermark)
  const buildFullContent = (bodyHtml: string) => {
    const safeBody = bodyHtml && bodyHtml.trim() !== "" ? bodyHtml : DEFAULT_AMHARIC_BODY;
    return `
      <div class="letter-root" style="
        font-family: Helvetica, Arial, sans-serif;
        color: #111;
        min-height: 980px;
        background-color: #fff;
      ">
        ${HEADER_HTML}
        <div id="letter-body" style="padding: 24px 40px 8px 40px; min-height:520px; font-size:14px; line-height:1.7;">
          ${safeBody}
        </div>
        ${FOOTER_HTML}
      </div>
    `;
  };

  // Extract only the letter body (what we persist in Formik)
  const extractBodyFromFullContent = (fullContent: string) => {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(fullContent || "", "text/html");
      const bodyDiv = doc.getElementById("letter-body");
      if (bodyDiv) {
        return bodyDiv.innerHTML;
      }
      return fullContent;
    } catch (err) {
      console.warn("extractBodyFromFullContent failed:", err);
      return fullContent;
    }
  };

  // When editor changes -> update Formik with only body
  const handleEditorChange = (fullContent: string) => {
    if (readOnly) return;
    const bodyHtml = extractBodyFromFullContent(fullContent);
    setFieldValue(name, bodyHtml);
  };

  // Insert selected template (replaces body content)
  const handleTemplateChange = (templateLabel: string) => {
    if (readOnly) return;
    const template = templates.find((t) => t.label === templateLabel);
    if (!template) return;

    setSelectedTemplate(templateLabel);
    setFieldValue(name, template.content);
    if (editorRef.current) {
      editorRef.current.setContent(buildFullContent(template.content));
      try {
        // place cursor at end
        const ed = editorRef.current;
        ed.selection.select(ed.getBody(), true);
        ed.selection.collapse(false);
      } catch (e) {
        // ignore
      }
    }
  };

  // Insert user's signature image into the body (appends to body)
  const handleInsertSignature = () => {
    if (readOnly) return;
    if (!user?.signatureId) {
      alert("No signature found for this user.");
      return;
    }
    const sigUrl = getDocumentUrl(user.signatureId);
    const imgHtml = `<p><img src="${sigUrl}" alt="Signature" style="width:180px; height:auto;"/></p>`;

    const currentFull = editorRef.current ? editorRef.current.getContent() : buildFullContent(field.value || "");
    const currentBody = extractBodyFromFullContent(currentFull);
    const newBody = (currentBody || "") + imgHtml;

    setFieldValue(name, newBody);
    if (editorRef.current) {
      editorRef.current.setContent(buildFullContent(newBody));
      try {
        const ed = editorRef.current;
        ed.selection.select(ed.getBody(), true);
        ed.selection.collapse(false);
      } catch (e) {
        // ignore
      }
    }
  };

  // Keep editor in sync when external Formik value changes
  useEffect(() => {
    if (editorRef.current) {
      const full = buildFullContent(field.value || "");
      const cur = editorRef.current.getContent();
      if (cur !== full) {
        editorRef.current.setContent(full);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [field.value]);

  return (
    <Box>
      {!readOnly && (
        <Box sx={{ mb: 2, display: "flex", gap: 2, flexWrap: "wrap" }}>
          <Select
            size="small"
            value={selectedTemplate}
            displayEmpty
            onChange={(e) => handleTemplateChange(e.target.value as string)}
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
        </Box>
      )}

      <Editor
        apiKey="mb9nytfiqqu0o92su6xttcmxb8nme0f74u7z8lpwco52ilga"
        onInit={(_: any, editor: any) => {
          editorRef.current = editor;
          // Initialize editor content with header+default body+footer
          const initialFull = buildFullContent(field.value || DEFAULT_AMHARIC_BODY);
          editor.setContent(initialFull);
        }}
        value={buildFullContent(field.value || DEFAULT_AMHARIC_BODY)}
        onEditorChange={(content: any) => handleEditorChange(content)}
        init={{
          height: 780,
          menubar: readOnly ? false : true,
          plugins: readOnly
            ? ""
            : "print preview pagebreak code fullscreen searchreplace autolink autosave save directionality visualblocks visualchars image link media table charmap hr anchor insertdatetime advlist lists wordcount",
          toolbar: readOnly
            ? ""
            : "undo redo | formatselect | bold italic underline | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | pagebreak | image link | code preview print",
          content_style: `
            body {
              font-family: Helvetica, Arial, sans-serif;
              font-size: 14px;
              margin: 0;
            }
            .letter-root { background-color: #fff; }
            .letter-header, .letter-footer { user-select: none; }
            [contenteditable="false"] { -webkit-user-modify: read-only; }
            #letter-body p { margin: 0 0 12px 0; }
          `,
        }}
      />
    </Box>
  );
};

export default FormRichLetterTextField;
