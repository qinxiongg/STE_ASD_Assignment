use `asd_assignment`;

CREATE TABLE data (
    postId INT,
	id INT, 
    name VARCHAR(255),
    email VARCHAR(255),
    body MEDIUMTEXT,
    PRIMARY KEY(postId, id)
);