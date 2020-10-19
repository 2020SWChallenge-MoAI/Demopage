# HOW TO EXECUTE : `mysql > source <file_path>`

#################################### root ####################################
#create user 'demo_webserver'@'localhost' identified by 'demo_webserver';
#grant all privileges on demo_webserver.* to 'demo_webserver'@'localhost';

############################### demo_webserver ###############################
# create database
drop database if exists demo_webserver;
create database demo_webserver;
use demo_webserver;

# create table
create table Keyword(kid int primary key auto_increment, bid int not null, keyword varchar(100) not null, weight float not null, created_at datetime not null, module_version varchar(10) not null, good_count int not null default 0, bad_count int not null default 0);

create table MainSentence(sid int primary key auto_increment, bid int not null, main_sentence text not null, rank float not null, created_at datetime not null, module_version varchar(10), good_count int not null default 0, bad_count int not null default 0);

#create table NER(wid int primary key auto_increment, bid int not null, sentence_idx int not null, word_idx int not null, word varchar(30) not null, tag varchar(5) not null, module_version varchar(10) not null, TRM_B int not null default 0, TRM_I int not null default 0, LOC_B int not null default 0, LOC_I int not null default 0, CVL_B int not null default 0, CVL_I int not null default 0, ANM_B int not null default 0, ANM_I int not null default 0, ORG_B int not null default 0, ORG_I int not null default 0, EVT_B int not null default 0, EVT_I int not null default 0, DAT_B int not null default 0, DAT_I int not null default 0, NUM_B int not null default 0, NUM_I int not null default 0, PER_B int not null default 0, PER_I int not null default 0, TIM_B int not null default 0, TIM_I int not null default 0, AFW_B int not null default 0, AFW_I int not null default 0, FLD_B int not null default 0, FLD_I int not null default 0, MAT_B int not null default 0, MAT_I int not null default 0, PLT_B int not null default 0, PLT_I int not null default 0, O int not null default 0, unique bid_sentence_word_idx(bid, sentence_idx, word_idx));
