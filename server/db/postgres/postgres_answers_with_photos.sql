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