
-- this is just PostgreSQL code, and

DROP TABLE questions;

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

-- Fields from file:
-- id
-- product_id
-- body
-- date_written
-- asker_name
-- asker_email
-- reported
-- helpful


-- things to handle in controller:
-- 1. date - TO_DATE('string', 'MM/DD/YYYY')
-- 2. reported - change 0, 1 to boolean true, false
-- 3.


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
-- INSERT INTO questions (
--   product_id,
--   question_body,
--   instant,
--   asker_name,
--   asker_email,
--   reported,
--   helpful
-- )
-- VALUES (3,'What fabric is the front made of?','Sun Jun 07 2020 16:20:04-240','internethistorian','first.last@gmail.com',false,1);
-- INSERT INTO questions (id, product_id, question_body, instant, asker_name, asker_email, reported, helpful) VALUES (4, 3,'Why is this product cheaper here than other sites?','Mon May 25 2020 09:33:22-240','jbilas','first.last@gmail.com',false,6);