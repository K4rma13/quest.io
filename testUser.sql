INSERT INTO user (username,email,passwd) VALUES ('Testeuser','kaka@gmail.com','$2b$10$5Z9IBbOOqM44NWwYrq9zqOMvu1FFe5.kwwebiCVVRixItDmMCWHgC');

INSERT INTO questionaire (title ,ownerid) VALUES ("Questionario Teste",1);

--@block
INSERT INTO question (questionaire_id, ord, quest, answers) VALUES (1,1,"Maior burro","Santos;Juan;Jota");
INSERT INTO question (questionaire_id, ord, quest, answers) VALUES (1,2,"Maior burra","Filipa;Maggie;Maria;Ines");

--@block
INSERT INTO rooms (label,descr,ownerid,available,capacity,quest_id) VALUES ('New Quest','sala para testes',4,1,8,8);
--@block
INSERT INTO rooms (label,descr,ownerid,available,capacity,quest_id) VALUES ('Nome ainda mais top','sala testes',2,1,4,1);
INSERT INTO rooms (label,descr,passwd,ownerid,available,capacity,quest_id) VALUES ('Average sala','testes imprevisiveis','batatinha',4,1,4,1);
