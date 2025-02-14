import type React from "react";
import { useEffect, useState } from "react";
import { useLoaderData } from "react-router-dom";
import api from "../../services/api";
import "./Profil.css";

interface ProfilData {
  id: number;
  username: string;
  email: string;
  created_at: string;
}

interface Pet {
  id: number;
  owner_id: number;
  name: string;
  species: "Chien" | "Chat" | "Lapin" | "Autre";
  breed: string;
  age: number | undefined;
  description: string;
  photo_url: string;
  created_at: string;
}

interface LoaderData {
  user: ProfilData;
  myPets: Pet[];
}

function Profil() {
  const { user, myPets } = useLoaderData() as LoaderData;

  const [pets, setPets] = useState<Pet[]>(myPets); // ✅ Utilisation directe de `myPets`
  const [newPet, setNewPet] = useState<Omit<Pet, "id" | "created_at">>({
    owner_id: user.id,
    name: "",
    species: "Chien",
    breed: "",
    age: undefined,
    description: "",
    photo_url: "",
  });

  // ✅ Mise à jour des animaux après un ajout
  useEffect(() => {
    setPets(myPets);
  }, [myPets]);

  // Gestion de l'ajout d'un nouvel animal
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setNewPet({ ...newPet, [e.target.name]: e.target.value });
  };

  const handleAddPet = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPet.name || !newPet.description) {
      alert("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    try {
      const res = await api.post("/pets", newPet);
      setPets([...pets, res.data]);
      setNewPet({
        owner_id: user.id,
        name: "",
        species: "Chien",
        breed: "",
        age: undefined,
        description: "",
        photo_url: "",
      });

      const response = await api.post("/pets", newPet);
      setPets([...pets, response.data]);
    } catch (err) {
      console.error("Erreur lors de l'ajout :", err);
    }
  };

  // Vérification des données utilisateur
  if (!user) {
    return <h2 className="error">Impossible de charger le profil.</h2>;
  }

  return (
    <section className="profil-container">
      <h1>Mon Profil</h1>
      <table className="profil-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nom d'utilisateur</th>
            <th>Email</th>
            <th>Créé le</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{user.id}</td>
            <td>{user.username}</td>
            <td>{user.email}</td>
            <td>{new Date(user.created_at).toLocaleDateString()}</td>
          </tr>
        </tbody>
      </table>

      <h2>Mes Animaux</h2>
      <div className="pets-container">
        {pets.length === 0 ? (
          <p>Aucun animal enregistré.</p>
        ) : (
          pets.map((pet) => (
            <div className="pet-card" key={pet.id}>
              <img
                src={pet.photo_url || "https://via.placeholder.com/150"}
                alt={pet.name}
              />
              <h3>{pet.name}</h3>
              <p>
                <strong>Espèce :</strong> {pet.species}
              </p>
              {pet.breed && (
                <p>
                  <strong>Race :</strong> {pet.breed}
                </p>
              )}
              <p>
                <strong>Âge :</strong>{" "}
                {pet.age ? `${pet.age} ans` : "Non spécifié"}
              </p>
              <p>{pet.description}</p>
            </div>
          ))
        )}
      </div>

      <h2>Ajouter un Animal</h2>
      <form className="add-pet-form" onSubmit={handleAddPet}>
        <input
          type="text"
          name="name"
          value={newPet.name}
          onChange={handleInputChange}
          placeholder="Nom"
          required
        />
        <select
          name="species"
          value={newPet.species}
          onChange={handleInputChange}
        >
          <option value="Chien">Chien</option>
          <option value="Chat">Chat</option>
          <option value="Lapin">Lapin</option>
          <option value="Autre">Autre</option>
        </select>
        <input
          type="text"
          name="breed"
          value={newPet.breed}
          onChange={handleInputChange}
          placeholder="Race"
        />
        <input
          type="number"
          name="age"
          value={newPet.age || ""}
          onChange={handleInputChange}
          placeholder="Âge"
        />
        <textarea
          name="description"
          value={newPet.description}
          onChange={handleInputChange}
          placeholder="Description"
          required
        />
        <input
          type="text"
          name="photo_url"
          value={newPet.photo_url}
          onChange={handleInputChange}
          placeholder="URL de la photo"
        />
        <button type="submit">Ajouter</button>
      </form>
    </section>
  );
}

export default Profil;
