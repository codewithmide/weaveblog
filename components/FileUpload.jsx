import { useRef, useState, useEffect } from "react";
import classnames from "@/utils/classnames";
import { IoMdClose } from "react-icons/io";
import { RiImageAddLine } from "react-icons/ri";

export default function FileUpload ({
  image,
  handleFileChange,
  classname,
  id,
  imageClassname = "rounded-md",
}) {
  const fileInputRef = useRef(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    if (image) {
      setImagePreview(image);
    }
  }, [image]);

  const onFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setImagePreview(selectedFile);
    handleFileChange(e);
  };

  const clear = () => {
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    handleFileChange(null);
  };

  return (
    <div className={classnames("w-full max-h-[400px] relative", classname)}>
      <input
        type="file"
        id={id}
        className=""
        onChange={onFileChange}
        style={{ display: "none" }}
        ref={fileInputRef}
        accept=".jpg, .jpeg, .png"
      />
      {!imagePreview && !image ? (
        <div
          className="cursor-pointer flex items-center w-full gap-3 rounded-md p-2 text-center"
          onClick={() => fileInputRef.current.click()}
        >
          <RiImageAddLine />
          <p className="text-dark-secondary">Add cover image</p>
        </div>
      ) : imagePreview ? (
        <div className="flex w-full relative flex-col justify-start items-start">
          <img
            src={typeof imagePreview === "string" ? imagePreview : URL.createObjectURL(imagePreview)}
            alt="Selected Image"
            className={classnames("object-cover w-full h-[400px]", imageClassname)}
            onClick={() => fileInputRef.current.click()}
          />
          <span
            className="p-2 absolute z-50 top-2 right-2 flex gap-2 text-red-600 bg-white w-auto"
            onClick={clear}
          >
            <p className="text-dark font-light">
              {typeof imagePreview === "string" ? imagePreview.split('/').pop() : imagePreview.name || "file.png"}
            </p>
            <IoMdClose />
          </span>
        </div>
      ) : (
        image && (
          <img
            src={image}
            alt="Image"
            className={classnames("object-cover w-full h-full", imageClassname)}
          />
        )
      )}
    </div>
  );
};
