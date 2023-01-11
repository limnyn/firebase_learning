import React from "react";

const Nweet = ({ nweetObj, isOwner }) => {
  return (
    <div>
      <h4>{nweetObj.text}</h4>
      {isOwner && (
        <>
          <button>Edit Nweet</button>
          <button>Delete Nweet</button>
        </>
      )}
    </div>
  );
};

export default Nweet;
