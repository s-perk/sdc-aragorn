


DROP TABLE questions CASCADE;
-- cascade = delete all dependents as well (foreign keys, indexes)

CREATE TABLE questions (
  id BIGSERIAL NOT NULL PRIMARY KEY,
  product_id bigint NOT NULL,
  question_body varchar(1000) NOT NULL,
  instant timestamp NOT NULL,
  asker_name varchar(60) NOT NULL,
  asker_email varchar(60) NOT NULL,
  reported boolean,
  helpful integer,
  answers_index bigint[]
);

-- Create a products index
CREATE INDEX idx_product_id ON questions(product_id);

-- INSERT INTO questions (
--   product_id,
--   question_body,
--   instant,
--   asker_name,
--   asker_email,
--   reported,
--   helpful
-- )

-- VALUES (
--   1,
--   'What fabric is the top made of?',
--   TO_TIMESTAMP('01/03/2014', 'MM/DD/YYYY'),
--   'yankeelover',
--   'first.last@gmail.com',
--   true,
--   2,
--   '{1223123, 90808908}'
-- );


DROP TABLE answers CASCADE;

CREATE TABLE answers (
  id BIGSERIAL NOT NULL PRIMARY KEY,
  question_id bigint NOT NULL,
  answer_body varchar(1000) NOT NULL,
  instant timestamp NOT NULL,
  answerer_name varchar(60) NOT NULL,
  answerer_email varchar(60),
  reported boolean,
  helpful integer,

  FOREIGN KEY (question_id) REFERENCES questions
);

-- Create a questions index
CREATE INDEX idx_question_id ON answers(question_id);


-- INSERT INTO answers (
--   id,
--   question_id,
--   answer_body,
--   instant,
--   answerer_name,
--   answerer_email,
--   reported,
--   helpful
-- )

-- VALUES (
--   1,
--   36,
--   'Supposedly suede but I think its synthetic',
--   1599958385988,
--   'sillyguy',
--   'first.last@gmail.com',
--   0,
--   1
-- );

DROP TABLE answer_photos CASCADE;

CREATE TABLE answer_photos (
  id BIGSERIAL NOT NULL PRIMARY KEY,
  answer_id bigint NOT NULL,
  "url" varchar(1000) NOT NULL,

  FOREIGN KEY (answer_id) REFERENCES answers
);

-- Create an answers index
CREATE INDEX idx_answer_id ON answer_photos(answer_id);