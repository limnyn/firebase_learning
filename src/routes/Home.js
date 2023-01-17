import { dbService } from "fBase";
import React, { useEffect, useState } from "react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";

import Nweet from "components/Nweet";
import NweetFactory from "components/NweetFactory";

const Home = ({ userObj }) => {
  //state for form
  const [nweets, setNweets] = useState([]);

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

  return (
    <div className="container">
      <NweetFactory userObj={userObj} />
      <div style={{ marginTop: 30 }}>
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
