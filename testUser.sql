INSERT INTO user (username,email,passwd) VALUES ('Testeuser','kaka@gmail.com','$2b$10$5Z9IBbOOqM44NWwYrq9zqOMvu1FFe5.kwwebiCVVRixItDmMCWHgC');

INSERT INTO questionaire (title ,ownerid) VALUES ("Questionario Teste",1);

--@block
INSERT INTO question (questionaire_id, ord, quest, answers) VALUES (1,1,"Maior burro","Santos;Juan;Jota");
INSERT INTO question (questionaire_id, ord, quest, answers) VALUES (1,2,"Maior burra","Filipa;Maggie;Maria;Ines");


INSERT INTO rooms (label,descr,ownerid,available,capacity,quest_id) VALUES ('nome top','sala para testes',1,1,4,1);
INSERT INTO rooms (label,descr,ownerid,available,capacity,quest_id) VALUES ('Nome ainda mais top','sala testes',1,1,4,1);
INSERT INTO rooms (label,descr,passwd,ownerid,available,capacity,quest_id) VALUES ('Average sala','testes imprevisiveis','batatinha',1,1,4,1);

--@block
INSERT INTO answer (questionaire_id,answeredby,choice,ord) VALUES (1,"Jose",1,1);