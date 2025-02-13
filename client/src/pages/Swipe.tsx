import React, { useState, useMemo, useRef } from "react";
import TinderCard from "react-tinder-card";

const db = [
  {
    name: "Richard Hendricks",
    url: "https://picsum.photos/200/300?random=1",
  },
  {
    name: "Erlich Bachman",
    url: "https://picsum.photos/200/300?random=2",
  },
  {
    name: "Monica Hall",
    url: "https://picsum.photos/200/300?random=3",
  },
  {
    name: "Jared Dunn",
    url: "https://picsum.photos/200/300?random=4",
  },
  {
    name: "Dinesh Chugtai",
    url: "https://picsum.photos/200/300?random=5",
  },
];

interface OutOfFrameProps {
  name: string;
  idx: number;
}
function Swipe() {
  const [currentIndex, setCurrentIndex] = useState<number>(db.length - 1);
  const [lastDirection, setLastDirection] = useState("");
  // used for outOfFrame closure
  const currentIndexRef = useRef(currentIndex);

  const childRefs = useMemo(
    () =>
      Array(db.length)
        .fill(0)
        .map(() =>
          React.createRef<{
            swipe: (dir: "left" | "right") => Promise<void>;
            restoreCard: () => Promise<void>;
          }>(),
        ),
    [],
  );

  const updateCurrentIndex = (val: number): void => {
    setCurrentIndex(val);
    currentIndexRef.current = val;
  };

  const canSwipe = currentIndex >= 0;

  // set last direction and decrease current index

  const swiped = (direction: string, index: number): void => {
    setLastDirection(direction);
    updateCurrentIndex(index - 1);
  };

  const outOfFrame = ({ name, idx }: OutOfFrameProps): void => {
    console.info(`${name} (${idx}) left the screen!`, currentIndexRef.current);
    // handle the case in which go back is pressed before card goes outOfFrame
    if (currentIndexRef.current >= idx) {
      console.warn(`Card ${idx} is out of frame and cannot be restored.`);
    }
    // TODO: when quickly swipe and restore multiple times the same card,
    // it happens multiple outOfFrame events are queued and the card disappear
    // during latest swipes. Only the last outOfFrame event should be considered valid
  };

  const swipe = async (dir: "left" | "right") => {
    if (canSwipe && currentIndex < db.length) {
      if (childRefs[currentIndex].current) {
        childRefs[currentIndex].current.swipe(dir); // Swipe the card!
      }
    }
  };

  return (
    <div>
      <link
        href="https://fonts.googleapis.com/css?family=Damion&display=swap"
        rel="stylesheet"
      />
      <link
        href="https://fonts.googleapis.com/css?family=Alatsi&display=swap"
        rel="stylesheet"
      />
      <h1>React Tinder Card</h1>
      <div className="cardContainer">
        {db.map((character, index) => (
          <TinderCard
            ref={childRefs[index]}
            className="swipe"
            key={character.name}
            onSwipe={(dir) => swiped(dir, index)}
            onCardLeftScreen={() =>
              outOfFrame({ name: character.name, idx: index })
            }
          >
            <div
              style={{
                backgroundImage: `url(${character.url})`,
              }}
              className="card"
            >
              <h3>{character.name}</h3>
            </div>
          </TinderCard>
        ))}
      </div>
      <div className="buttons">
        <button
          type="button"
          style={{
            backgroundColor: !canSwipe ? "#c3c4d3" : undefined,
          }}
          onClick={() => swipe("left")}
        >
          Swipe left!
        </button>

        <button
          type="button"
          style={{
            backgroundColor: !canSwipe ? "#c3c4d3" : undefined,
          }}
          onClick={() => swipe("right")}
        >
          Swipe right!
        </button>
      </div>
      {lastDirection ? (
        <h2 key={lastDirection} className="infoText">
          You swiped {lastDirection}
        </h2>
      ) : (
        <h2 className="infoText">Swipe pour trouver l'amour de ta vie</h2>
      )}
    </div>
  );
}

export default Swipe;
