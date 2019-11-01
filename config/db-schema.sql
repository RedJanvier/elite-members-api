
create table members(
    id serial not null primary key,
    name varchar(200) not null, 
    email varchar(100) not null unique,
    location varchar(100) default 'ETE',
    shares bigint default 1,
    joined timestamp not null,
    committee varchar(100) unique,
    img varchar(255) default 'https://firebasestorage.googleapis.com/v0/b/learn-firebase-bbe9f.appspot.com/o/profiles%2Falain%40gmail.com.jpg?alt=media&token=2a01735f-6560-45ef-86b2-b6536dcfcb40'
);

create table login(
    id serial not null PRIMARY KEY,
    hash varchar(255) not null unique,
    email varchar(200) not null unique
);