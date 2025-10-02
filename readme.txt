creer une vue :

mysql> CREATE VIEW etudiant_modules_profiling AS
    -> SELECT
    ->     u.id AS user_id,
    ->     u.email,
    ->     m.id AS module_id,
    ->     m.nom AS module_nom,
    ->     FALSE AS profiling
    -> FROM
    ->     users u
    -> JOIN
    ->     modules m
    -> WHERE
    ->     u.role = 'etudiant';


creer une procedure : 
mysql> CREATE PROCEDURE CheckProfiling (
    ->     IN in_user_id INT,
    ->     IN in_module_id INT,
    ->     OUT is_profiling BOOLEAN
    -> )
    -> BEGIN
    ->     DECLARE prof_value INT;
    ->
    ->     SELECT profiling INTO prof_value
    ->     FROM etudiant_modules_profiling
    ->     WHERE user_id = in_user_id AND module_id = in_module_id
    ->     LIMIT 1;
    ->
    ->     SET is_profiling = (prof_value = 1);
    -> END$$



CREATE TABLE user_module_profiling (
    user_id INT NOT NULL,
    module_id INT NOT NULL,
    is_profiled BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (user_id, module_id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (module_id) REFERENCES modules(id)
);


CREATE OR REPLACE VIEW etudiant_modules_profiling AS
SELECT
    u.id AS user_id,
    u.email,
    m.id AS module_id,
    m.nom AS module_nom,
    COALESCE(ump.is_profiled, FALSE) AS profiling
FROM
    users u
CROSS JOIN
    modules m
LEFT JOIN
    user_module_profiling ump ON ump.user_id = u.id AND ump.module_id = m.id
WHERE
    u.role = 'etudiant';


