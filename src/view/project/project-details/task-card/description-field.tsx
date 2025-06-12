import { Editor } from "@tinymce/tinymce-react";

import "tinymce/tinymce";
import "tinymce/themes/silver/theme";
import "tinymce/icons/default/icons";

import "tinymce/plugins/advlist";
import "tinymce/plugins/autolink";
import "tinymce/plugins/lists";
import "tinymce/plugins/link";
import "tinymce/plugins/image";
import "tinymce/plugins/charmap";
import "tinymce/plugins/preview";
import "tinymce/plugins/anchor";
import "tinymce/plugins/code";
import "tinymce/plugins/insertdatetime";
import "tinymce/plugins/media";
import "tinymce/plugins/table";
import "tinymce/plugins/help";
import "tinymce/plugins/wordcount";
interface ITinyEditorComponentProps {
  initValue: string;
  setContent: (text: string) => void;
}
export default function TinyEditorComponent({
  initValue,
  setContent,
}: ITinyEditorComponentProps) {
  return (
    <Editor
      licenseKey="gpl"
      init={{
        height: 250,
        menubar: false,
        statusbar: false,
        suffix: ".min",
        placeholder: "Write something...",
        base_url: "/tinymce",
        plugins: [
          "advlist",
          "autolink",
          "lists",
          "link",
          "image",
          "charmap",
          "preview",
          "anchor",
          "code",
          "insertdatetime",
          "media",
          "table",
          "help",
          "wordcount",
        ],
        toolbar:
          "undo redo | formatselect | bold italic underline| " +
          "alignleft aligncenter alignright alignjustify | " +
          "bullist numlist outdent indent | removeformat | help",
      }}
      onEditorChange={(content: string) => setContent(content)}
      initialValue={initValue}
    />
  );
}
