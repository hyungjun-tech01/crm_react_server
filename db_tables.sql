-- 기업관리 테이블 

drop table tbl_company_info;

create table tbl_company_info
(company_code                 varchar	(32)   PRIMARY KEY,
company_number               varchar	(50)   ,
group_                        varchar	(255)  ,
company_scale                varchar	(100)  ,
deal_type                    varchar	(100)  ,
company_name                 varchar	(50)   ,
company_name_eng             varchar	(100)  ,
business_registration_code   varchar	(50)   ,
establishment_date           date	         ,
closure_date                 date	         ,
ceo_name                     varchar	(50)   ,
business_type                varchar	(100)  ,
business_item                varchar	(100)  ,
industry_type                varchar	(50)   ,
company_zip_code             varchar	(50)   ,
company_address              varchar	(255)  ,
company_phone_number         varchar	(50)   ,
company_fax_number           varchar	(50)   ,
homepage                     varchar	(255)  ,
memo                         text	         ,
create_user                  varchar	(50)   ,
create_date                  date	         ,
modify_date                  date	         ,
recent_user                  varchar	(50)   ,
counter                      integer	     ,
account_code                 varchar	(50)   ,
bank_name                    varchar	(50)   ,
account_owner                varchar	(50)   ,
sales_resource               varchar	(50)   ,
application_engineer         varchar	(50)   ,
region                       varchar	(50)   
);

COPY tbl_company_info (  company_code,
company_number,
group_,
company_scale,
deal_type,
company_name,
company_name_eng,
business_registration_code,
ceo_name,
business_type,
business_item,
industry_type,
company_zip_code,
company_address,
company_phone_number,
company_fax_number,
homepage,
memo,
create_user,
recent_user,
account_code,
bank_name,
account_owner,
sales_resource,
application_engineer,
region)
 FROM 'd:\company_info.csv' csv;



drop table tbl_leads_info;

CREATE TABLE tbl_leads_info(                                             
 leads_code              varchar(32)   PRIMARY KEY,
company_code            varchar(32) ,
leads_index             integer     ,
company_index           integer     ,
lead_number             varchar(50) ,
group_                  varchar(255),
sales_resource          varchar(50) ,
region                  varchar(50) ,
company_name            varchar(50) ,
company_zip_code        varchar(50) ,
company_address         varchar(50) ,
company_phone_number    varchar(100),
company_fax_number      varchar(100),
leads_name              varchar(50) ,
is_keyman               varchar(50) ,
department              varchar(50) ,
position                varchar(50) ,
mobile_number           varchar(50) ,
company_name_en         varchar(100),
email                   varchar(255),
homepage                varchar(255),
create_user             varchar(50) ,
create_date             date	      ,
modify_date             date	      ,
recent_user             varchar(50) ,
counter                 integer     ,
application_engineer    varchar(50) ,
status                  varchar(50)
);

COPY tbl_leads_info (  leads_code,
company_code,
lead_number,
group_,
sales_resource,
region,
company_name,
company_zip_code,
company_address,
company_phone_number,
company_fax_number,
leads_name,
is_keyman,
department,
position,
mobile_number,
company_name_en,
email,
homepage,
create_user,
recent_user,
application_engineer,
status)
FROM 'd:\lead_info.csv' csv;

drop table invoce; 
drop table company;
drop table lead;

-- 사용자 Info Table 

drop table tbl_user_info;

CREATE TABLE tbl_user_info (
  user_id varchar(50) PRIMARY KEY, 
  user_name varchar(50), 
  password varchar(50), 
  mobile_number varchar(50), 
  phone_number varchar(50), 
  department varchar(50), 
  position varchar(50), 
  email varchar(50), 
  group text, 
  memo text, 
  );
