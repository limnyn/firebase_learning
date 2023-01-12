import { dbService, storageService } from "fBase";
import { v4 as uuidv4 } from "uuid";
import React, { useEffect, useRef, useState } from "react";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  addDoc,
} from "firebase/firestore";
import { ref, uploadString, getDownloadURL } from "@firebase/storage";

import Nweet from "components/Nweet";

const Home = ({ userObj }) => {
  //state for form
  const [nweet, setNweet] = useState("");
  const [nweets, setNweets] = useState([]);
  const [attachemnt, setAttachment] = useState("");
  const fileInput = useRef();

  //make realtime nweet check by using snapshot
  useEffect(() => {
    const q = query(
      collection(dbService, "nweets"),
      orderBy("createdAt", "desc")
    );
    onSnapshot(q, (snapshot) => {
      const nweetArr = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setNweets(nweetArr);
    });
  }, []);

  const onSubmit = async (event) => {
    event.preventDefault();
    let attachmentUrl = "";
    if (attachemnt !== "") {
      const attachemntRef = ref(storageService, `${userObj.uid}/${uuidv4()}`);
      const response = await uploadString(
        attachemntRef,
        attachemnt,
        "data_url"
      );
      console.log(await getDownloadURL(response.ref));
      attachmentUrl = await getDownloadURL(response.ref);
    }
    const nweetObj = {
      text: nweet,
      createdAt: Date.now(),
      creatorId: userObj.uid,
      attachmentUrl,
    };
    // //save nweet where collection's name is "nweets"
    await addDoc(collection(dbService, "nweets"), nweetObj);
    setNweet("");
    setAttachment("");
  };

  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setNweet(value);
  };
  const onFileChange = (event) => {
    const {
      target: { files },
    } = event;
    const theFile = files[0];
    const reader = new FileReader();
    reader.onloadend = (finishedEvent) => {
      console.log(finishedEvent);
      const {
        currentTarget: { result },
      } = finishedEvent;
      setAttachment(result);
    };
    reader.readAsDataURL(theFile);
  };
  const onClearAttachment = () => {
    setAttachment("");
    fileInput.current.value = "";
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          value={nweet}
          onChange={onChange}
          type="text"
          placeholder="What's on yout mind?"
          maxLength={120}
        />
        <input
          type="file"
          accept="image/*"
          onChange={onFileChange}
          ref={fileInput}
        />
        <input type="submit" value="Nweet" />
        {attachemnt && (
          <div>
            <img src={attachemnt} width="50px" height="50px" />
            <button onClick={onClearAttachment}>Clear</button>
          </div>
        )}
      </form>
      <div>
        {nweets.map((nweet) => (
          <Nweet
            key={nweet.id}
            nweetObj={nweet}
            isOwner={nweet.creatorId === userObj.uid}
          />
        ))}
      </div>
    </div>
  );
};
export default Home;

/**
 * 1) Storage().ref().child() return Reference - storage의 이미지 폴더 생성.
2) Reference.putString() - 이 작업이 폴더에 이미지를 넣는 작업.
3) Reference.putString() return (완료시 UploadTaskSnapshot을 받음)
4) UploadTaskSnapshot.ref.getDownloadURL() - 이 작업에서 ref 속성을 쓰면 그 이미지의 Reference에 접근 가능, 이미지가 저장된 stroage 주소를 받을 수 있다.
 */
