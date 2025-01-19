-- SQL Script for Detailed University Schema

-- Create Table Statements
CREATE TABLE department (
    dept_name VARCHAR(50) PRIMARY KEY,
    building VARCHAR(50),
    budget DECIMAL(10, 2)
);

CREATE TABLE course (
    course_id VARCHAR(10) PRIMARY KEY,
    title VARCHAR(100),
    dept_name VARCHAR(50),
    credits INT,
    FOREIGN KEY (dept_name) REFERENCES department(dept_name)
);

CREATE TABLE instructor (
    ID INT PRIMARY KEY,
    name VARCHAR(50),
    dept_name VARCHAR(50),
    salary DECIMAL(10, 2),
    FOREIGN KEY (dept_name) REFERENCES department(dept_name)
);

CREATE TABLE student (
    ID INT PRIMARY KEY,
    name VARCHAR(50),
    dept_name VARCHAR(50),
    tot_cred INT,
    FOREIGN KEY (dept_name) REFERENCES department(dept_name)
);

CREATE TABLE advisor (
    s_ID INT,
    i_ID INT,
    PRIMARY KEY (s_ID),
    FOREIGN KEY (s_ID) REFERENCES student(ID),
    FOREIGN KEY (i_ID) REFERENCES instructor(ID)
);

CREATE TABLE prereq (
    course_id VARCHAR(10),
    prereq_id VARCHAR(10),
    PRIMARY KEY (course_id, prereq_id),
    FOREIGN KEY (course_id) REFERENCES course(course_id),
    FOREIGN KEY (prereq_id) REFERENCES course(course_id)
);

CREATE TABLE classroom (
    building VARCHAR(50),
    room_number INT,
    capacity INT,
    PRIMARY KEY (building, room_number)
);

CREATE TABLE time_slot (
    time_slot_id VARCHAR(10) PRIMARY KEY,
    day VARCHAR(10),
    start_time TIME,
    end_time TIME
);

CREATE TABLE section (
    course_id VARCHAR(10),
    sec_id INT,
    semester VARCHAR(10),
    year INT,
    building VARCHAR(50),
    room_number INT,
    time_slot_id VARCHAR(10),
    PRIMARY KEY (course_id, sec_id, semester, year),
    FOREIGN KEY (course_id) REFERENCES course(course_id),
    FOREIGN KEY (building, room_number) REFERENCES classroom(building, room_number),
    FOREIGN KEY (time_slot_id) REFERENCES time_slot(time_slot_id)
);

CREATE TABLE teaches (
    ID INT,
    course_id VARCHAR(10),
    sec_id INT,
    semester VARCHAR(10),
    year INT,
    PRIMARY KEY (ID, course_id, sec_id, semester, year),
    FOREIGN KEY (ID) REFERENCES instructor(ID),
    FOREIGN KEY (course_id, sec_id, semester, year) REFERENCES section(course_id, sec_id, semester, year)
);

CREATE TABLE takes (
    ID INT,
    course_id VARCHAR(10),
    sec_id INT,
    semester VARCHAR(10),
    year INT,
    grade CHAR(1),
    PRIMARY KEY (ID, course_id, sec_id, semester, year),
    FOREIGN KEY (ID) REFERENCES student(ID),
    FOREIGN KEY (course_id, sec_id, semester, year) REFERENCES section(course_id, sec_id, semester, year)
);

-- Insert Data into Tables
-- Departments
INSERT INTO department VALUES ('CSE', 'Engineering Building', 1000000.00);
INSERT INTO department VALUES ('EEE', 'Tech Block', 850000.00);
INSERT INTO department VALUES ('ME', 'Mechanical Block', 900000.00);

-- Courses
INSERT INTO course VALUES ('CSE101', 'Introduction to Programming', 'CSE', 3);
INSERT INTO course VALUES ('CSE201', 'Data Structures', 'CSE', 4);
INSERT INTO course VALUES ('EEE101', 'Circuit Analysis', 'EEE', 3);
INSERT INTO course VALUES ('ME101', 'Thermodynamics', 'ME', 4);

-- Instructors
INSERT INTO instructor VALUES (101, 'Dr. Alice', 'CSE', 90000.00);
INSERT INTO instructor VALUES (102, 'Dr. Bob', 'EEE', 85000.00);
INSERT INTO instructor VALUES (103, 'Dr. Carol', 'ME', 88000.00);

-- Students
INSERT INTO student VALUES (201, 'John Doe', 'CSE', 12);
INSERT INTO student VALUES (202, 'Jane Smith', 'EEE', 9);
INSERT INTO student VALUES (203, 'Mike Johnson', 'ME', 6);

-- Advisors
INSERT INTO advisor VALUES (201, 101);
INSERT INTO advisor VALUES (202, 102);
INSERT INTO advisor VALUES (203, 103);

-- Prerequisites
INSERT INTO prereq VALUES ('CSE201', 'CSE101');

-- Classrooms
INSERT INTO classroom VALUES ('Engineering Building', 101, 50);
INSERT INTO classroom VALUES ('Tech Block', 201, 60);
INSERT INTO classroom VALUES ('Mechanical Block', 301, 70);

-- Time Slots
INSERT INTO time_slot VALUES ('TS1', 'Monday', '08:00:00', '10:00:00');
INSERT INTO time_slot VALUES ('TS2', 'Wednesday', '10:00:00', '12:00:00');
INSERT INTO time_slot VALUES ('TS3', 'Friday', '02:00:00', '04:00:00');

-- Sections
INSERT INTO section VALUES ('CSE101', 1, 'Fall', 2024, 'Engineering Building', 101, 'TS1');
INSERT INTO section VALUES ('EEE101', 1, 'Fall', 2024, 'Tech Block', 201, 'TS2');
INSERT INTO section VALUES ('ME101', 1, 'Fall', 2024, 'Mechanical Block', 301, 'TS3');

-- Teaches
INSERT INTO teaches VALUES (101, 'CSE101', 1, 'Fall', 2024);
INSERT INTO teaches VALUES (102, 'EEE101', 1, 'Fall', 2024);
INSERT INTO teaches VALUES (103, 'ME101', 1, 'Fall', 2024);

-- Takes
INSERT INTO takes VALUES (201, 'CSE101', 1, 'Fall', 2024, 'A');
INSERT INTO takes VALUES (202, 'EEE101', 1, 'Fall', 2024, 'B');
INSERT INTO takes VALUES (203, 'ME101', 1, 'Fall', 2024, 'A');

-- Final Data Check
SELECT * FROM department;
SELECT * FROM course;
SELECT * FROM instructor;
SELECT * FROM student;
SELECT * FROM section;
