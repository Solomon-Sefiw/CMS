import { useField, useFormikContext } from "formik";
import { Editor } from "@tinymce/tinymce-react";
import { Box, Button, MenuItem, Select } from "@mui/material";
import { useRef, useState } from "react";

type TemplateOption = {
  label: string;
  content: string;
};

const templates: TemplateOption[] = [
  {
    label: "Official Letter",
    content: `<h2 style="text-align:center">OFFICIAL LETTER</h2><p>Dear Sir/Madam,</p><p>This is to inform you that ...</p><p>Sincerely,<br/><strong>[Your Name]</strong></p>`,
  },
  {
    label: "Internal Memo",
    content: `<h2 style="text-align:center">INTERNAL MEMO</h2><p>To: [Department]</p><p>Subject: [Subject]</p><p>This memo is intended to ...</p>`,
  },
];

export const FormRichLetterTextField = ({ name }: { name: string }) => {
  const { setFieldValue } = useFormikContext();
  const [field] = useField(name);
  const editorRef = useRef<any>();
  const [selectedTemplate, setSelectedTemplate] = useState("");

  // Template insert
  const handleTemplateInsert = (templateHtml: string) => {
    if (editorRef.current) {
      editorRef.current.insertContent(templateHtml);
    }
  };

  // Signature upload
  const handleSignatureInsert = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      const imgHtml = `<p><img src="${base64}" alt="Signature" style="width:180px; height:auto;" /></p>`;
      if (editorRef.current) {
        editorRef.current.insertContent(imgHtml);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <Box>
      <Box sx={{ mb: 2, display: "flex", gap: 2 }}>
      <Select
        size="small"
        value={selectedTemplate}
        displayEmpty
        onChange={(e) => {
        const selected = templates.find((t) => t.label === e.target.value);
        if (selected) {
          handleTemplateInsert(selected.content);
          setSelectedTemplate(e.target.value as string);
        }
        }}
      >
        <MenuItem value="" disabled>
        Insert Template
        </MenuItem>
        {templates.map((t: TemplateOption) => (
        <MenuItem key={t.label} value={t.label}>
          {t.label}
        </MenuItem>
        ))}
      </Select>

      <Button component="label" variant="outlined" size="small">
        Insert Signature
        <input type="file" accept="image/*" hidden onChange={handleSignatureInsert} />
      </Button>
      </Box>

      <Editor
      apiKey="mb9nytfiqqu0o92su6xttcmxb8nme0f74u7z8lpwco52ilga"
      onInit={(evt: unknown, editor: any) => (editorRef.current = editor)}
      value={field.value || ""}
      onEditorChange={(content: string) => setFieldValue(name, content)}
      init={{
        height: 700,
        menubar: true,
        plugins:
        "print preview pagebreak code fullscreen searchreplace autolink autosave save directionality visualblocks visualchars image link media table charmap hr anchor insertdatetime advlist lists wordcount",
        toolbar:
        "undo redo | formatselect | bold italic underline | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | pagebreak | image link | code preview print",
        content_style: `
        body {
          font-family:Helvetica,Arial,sans-serif;
          font-size:14px;
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
