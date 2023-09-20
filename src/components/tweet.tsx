import { styled } from "styled-components";
import { Tweets } from "./timeline";
import { auth, db, storage } from "../firebase";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useState } from "react";
import { TextArea, Form, AttachFileButton, AttachFileInput, SubmitBtn } from "./post-tweet-form";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
  margin: 20px 0px;
  border: 1.5px solid rgba(255, 255, 255, 0.8);
  border-radius: 20px;
`;

const Rows = styled.div`
  padding-bottom: 20px;
`;

const Photo = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 15px;
`;

const Username = styled.div`
  margin-bottom: 20px;
  font-weight: 600;
  font-size: 15px;
`;

const Payload = styled.p`
  margin: 10px 0px;
  font-size: 18px;
`;

const DeleteButton = styled.button`
  background-color: whitesmoke;
  font-weight: 600;
  border: 0;
  font-size: 18px;
  padding: 5px 10px;
  margin: 20px 10px 0 0;
  border-radius: 6px;
  cursor: pointer;
`;

const EditButton = styled.button`
  background-color: whitesmoke;
  color: #424242;
  font-weight: 600;
  border: 0;
  font-size: 18px;
  padding: 5px 10px;
  margin: 20px 10px 0 0;
  border-radius: 6px;
  cursor: pointer;
`;

export default function Tweet({ userName, photo, tweet, userId, id }: Tweets) {
  const user = auth.currentUser;
  const [edit, setEdit] = useState(false);
  const [newTweet, setNewTweet] = useState(tweet);
  const [newPhoto, setNewPhoto] = useState<File | null>(null);

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewTweet(e.target.value);
  };
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files && files.length === 1) {
      setNewPhoto(files[0]);
    }
  };

  const onDelete = async () => {
    const ok = confirm("Are you sure you want to delete this tweet?");
    if (!ok || user?.uid !== userId) return;
    try {
      await deleteDoc(doc(db, "tweets", id));
      if (photo) {
        const photoRef = ref(storage, `tweets/${user.uid}/${id}`);
        await deleteObject(photoRef);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const startEdit = () => {
    setEdit(true);
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const ok = confirm("Are you sure you want to edit this tweet?");
    if (!ok || !edit || user?.uid !== userId) return;
    try {
      await updateDoc(doc(db, "tweets", id), { tweet: newTweet });
      if (newPhoto) {
        const photoRef = ref(storage, `tweets/${user.uid}/${id}`);
        const result = await uploadBytes(photoRef, newPhoto);
        const url = await getDownloadURL(result.ref);
        await updateDoc(doc(db, "tweets", id), {
          photo: url,
        });
      }
      setNewTweet("");
      setNewPhoto(null);
    } catch (e) {
      console.log(e);
    } finally {
      //
    }
    setEdit(false);
  };

  return (
    <Wrapper>
      {photo ? <Rows>{edit ? null : <Photo src={photo} />}</Rows> : null}
      <Rows>
        <Username>{userName}</Username>
        {edit ? <TextArea required rows={5} maxLength={300} onChange={onChange} value={newTweet} /> : <Payload>{tweet}</Payload>}
        {edit ? null : user?.uid === userId ? (
          <>
            <EditButton onClick={startEdit}>✂️</EditButton>
            <DeleteButton onClick={onDelete}>🗑️</DeleteButton>
          </>
        ) : null}
        {edit && (
          <Form onSubmit={onSubmit}>
            <AttachFileButton htmlFor="{id}">{newPhoto ? "Photo added ✅" : "Add photo"}</AttachFileButton>
            <AttachFileInput onChange={onFileChange} type="file" id="{id}" accept="image/*" />
            <SubmitBtn type="submit">{"Edit Done!"}</SubmitBtn>
          </Form>
        )}
      </Rows>
    </Wrapper>
  );
}
