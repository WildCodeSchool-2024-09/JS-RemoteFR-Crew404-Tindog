import React, { useState, useRef, useEffect } from "react";
import Confetti from "react-confetti";
import { FaArrowLeft, FaArrowRight, FaGrinHearts } from "react-icons/fa";
import { FaFaceSadTear } from "react-icons/fa6";
import { useLoaderData } from "react-router-dom";
import TinderCard from "react-tinder-card";

import api from "../../services/api";
import "./Swipe.css";

interface Pet {
  age: number;
  breed: string;
  created_at: string;
  description: string;
  id: number;
  name: string;
  owner_id: number;
  photo_url: string;
  species: string;
}

interface OutOfFrameProps {
  name: string;
  idx: number;
}

interface TinderCardRef {
  swipe: (dir: "left" | "right") => Promise<void>;
  restoreCard: () => Promise<void>;
}

function Swipe() {
  const data = useLoaderData();
  const [pets, setPets] = useState<Pet[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isMatch, setIsMatch] = useState(false);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [lastDirection, setLastDirection] = useState<string | null>(null);
  const currentIndexRef = useRef<number>(0);

  // ✅ Toujours initialiser `childRefs` avec un tableau de la même taille
  const childRefs = useRef<Array<React.RefObject<TinderCardRef>>>(
    Array(50) // Mettons une valeur max ici pour garantir un nombre constant
      .fill(null)
      .map(() => React.createRef<TinderCardRef>()),
  );

  useEffect(() => {
    if (Array.isArray(data)) {
      setPets(data);
      setCurrentIndex(data.length > 0 ? data.length - 1 : 0);
      setIsLoading(false);
    } else {
      console.error("Data from useLoaderData is not an array:", data);
      setPets([]);
      setIsLoading(false);
    }
  }, [data]);

  // Gestion propre de la taille de l'écran
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Désactiver l'effet "match" après 10 secondes
  useEffect(() => {
    if (isMatch) {
      const timer = setTimeout(() => setIsMatch(false), 10000);
      return () => clearTimeout(timer);
    }
  }, [isMatch]);

  const updateCurrentIndex = (val: number): void => {
    setCurrentIndex(val);
    currentIndexRef.current = val;
  };

  const canSwipe = pets.length > 0 && currentIndex >= 0;

  const swiped = async (direction: string, index: number) => {
    setLastDirection(direction);
    updateCurrentIndex(index - 1);

    // Ici, on va envoyer une requête à l'API pour liker le pet
    if (direction === "right") {
      try {
        const response = await api.post("/likes", {
          pet_id: pets[index].id,
        });

        if (response.data.message === "match!") {
          setIsMatch(true);
        }
      } catch (error) {
        console.error("Error liking pet:", error);
      }
    }
  };

  const outOfFrame = ({ name, idx }: OutOfFrameProps): void => {
    console.info(`${name} (${idx}) left the screen!`, currentIndexRef.current);
    if (currentIndexRef.current >= idx) {
      console.warn(`Card ${idx} is out of frame and cannot be restored.`);
    }
  };

  // Sécurise `swipe()` pour éviter les erreurs
  const swipe = async (dir: "left" | "right") => {
    if (
      canSwipe &&
      currentIndex < pets.length &&
      childRefs.current[currentIndex]
    ) {
      await childRefs.current[currentIndex]?.current?.swipe(dir);
    }
  };

  if (isLoading) {
    return <h2 className="infoText">Chargement des animaux...</h2>;
  }

  //  Affiche un message si aucun `pet` n'est disponible
  if (pets.length === 0) {
    return (
      <h2 className="infoText">Aucun animal disponible pour le moment.</h2>
    );
  }

  return (
    <>
      {isMatch && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          numberOfPieces={200}
        />
      )}

      <section className="container-swipe">
        <h1>Tindog !</h1>
        <div className="cardContainer">
          {pets.map((pet, index) => (
            <TinderCard
              ref={childRefs.current[index]}
              className="swipe"
              key={pet.name}
              onSwipe={(dir) => swiped(dir, index)}
              onCardLeftScreen={() =>
                outOfFrame({ name: pet.name, idx: index })
              }
            >
              <div
                style={{
                  backgroundImage: `url(${pet.photo_url})`,
                }}
                className="card"
              >
                <h3>{pet.name}</h3>
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
            className="swipeButton"
          >
            <FaArrowLeft size={24} />
            <FaFaceSadTear size={24} />
          </button>
          <button
            type="button"
            style={{
              backgroundColor: !canSwipe ? "#c3c4d3" : undefined,
            }}
            className="swipeButton"
            onClick={() => swipe("right")}
          >
            <FaGrinHearts size={24} />
            <FaArrowRight size={24} />
          </button>
        </div>
        {lastDirection ? (
          <h2 key={lastDirection} className="infoText">
            You swiped {lastDirection}
          </h2>
        ) : (
          <h2 className="infoText">Swipe pour trouver l'amour de ta vie</h2>
        )}
      </section>
    </>
  );
}

export default Swipe;
