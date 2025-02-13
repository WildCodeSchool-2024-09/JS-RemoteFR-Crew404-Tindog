-- TABLE USERS (les maîtres des animaux)
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- TABLE PETS (les profils visibles)
CREATE TABLE pets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    owner_id INT NOT NULL,
    name VARCHAR(50) NOT NULL,
    species ENUM('Chien', 'Chat', 'Lapin', 'Autre') NOT NULL,
    breed VARCHAR(100),
    age INT,
    description TEXT NOT NULL,
    photo_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- TABLE LIKES (un utilisateur peut liker un profil d'animal)
CREATE TABLE likes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,     
    pet_id INT NOT NULL, 
    liked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (pet_id) REFERENCES pets(id) ON DELETE CASCADE,
    UNIQUE (user_id, pet_id)  
) ENGINE=InnoDB;


-- TABLE MATCHES (quand deux animaux se likent mutuellement)
CREATE TABLE matches (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user1_id INT NOT NULL,  
    user2_id INT NOT NULL,  
    matched_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user1_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (user2_id) REFERENCES users(id) ON DELETE CASCADE,
    CHECK (user1_id < user2_id),  
    UNIQUE (user1_id, user2_id) 
) ENGINE=InnoDB;


-- TABLE MESSAGES (les discussions après un match)
CREATE TABLE messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    match_id INT NOT NULL,
    sender_id INT NOT NULL,
    receiver_id INT NOT NULL,
    message TEXT NOT NULL,
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (match_id) REFERENCES matches(id) ON DELETE CASCADE,
    FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;


-- INSÉRER DES UTILISATEURS
-- Mot de passe : "azerty"
INSERT INTO users (username, email, password) VALUES
('Alice', 'alice@mail.com', '$argon2id$v=19$m=65536,t=4,p=1$E0fVFp3W9z22B8mc8JI8+g$Gv+jX4UgSVYzjXFPeSGbwHHiNAm0l1QTkq9QmaDb7AZ2BMV2q4jzH2174dlHuWpS0onRaaATczJNxsOG4/Wy6Q'),
('Bob', 'bob@mail.com', '$argon2id$v=19$m=65536,t=4,p=1$E0fVFp3W9z22B8mc8JI8+g$Gv+jX4UgSVYzjXFPeSGbwHHiNAm0l1QTkq9QmaDb7AZ2BMV2q4jzH2174dlHuWpS0onRaaATczJNxsOG4/Wy6Q');

-- INSÉRER DES ANIMAUX
INSERT INTO pets (owner_id, name, species, breed, age, description, photo_url) VALUES
(1, 'Bella', 'Chien', 'Labrador', 3, 'J\'aime les balades en forêt', 'https://placedog.net/300/300'),
(1, 'Milo', 'Chat', 'Siamois', 2, 'Je suis très câlin', 'https://placekitten.com/300/300'),
(2, 'Buddy', 'Chien', 'Golden Retriever', 4, 'J\'aime jouer avec les enfants', 'https://placedog.net/300/300'),
(2, 'Luna', 'Chat', 'Main coon', 5, 'J\'adore grimper partout', 'https://placekitten.com/300/300');


