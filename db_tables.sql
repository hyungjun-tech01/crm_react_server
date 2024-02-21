  drop table company;

  CREATE TABLE company                                   
  (id serial PRIMARY KEY,                                
  company_code varchar(32),                              
  customer_code varchar(32),                             
  business_code varchar(32),                             
  company_number varchar(50),                            
  group_ varchar(255),                                   
  relationship varchar(50),                              
  registration_date date,                                
  head_quater_responsible varchar(50),                   
   Business_strategy_area varchar2(50),                  
  Corporate_number varchar2(50),                         
  group_classification varchar2(100),                    
  Transaction_classification varchar2(100),              
  company_name varchar(50),                              
  company_name1 varchar(50),                             
   english_company_name varchar(100),                    
   Business_number  varchar2(50)                         
   start_date date,                                      
   end_date date,                                        
  representative varchar2(50),                           
     repr_resident_number varchar2(50),                  
 	state_business varchar2(100),                          
  type_ varchar2(100),                                   
     postal_code varchar(50),                            
     business_address varchar2(255),                     
    industry_class varchar(50),                          
     discount_policy number,                             
      trade_start_date date,                             
      trade_end_date  date,                              
      estimate_request_ varchar2(2)                      
       repr_birthday   date,                             
      repr_lunar_birthday varchar2(10),                  
       repr_solar_birthday date,                         
      company_postal_code1 varchar2(50),                 
      company_address1 varchar2(255),                    
      company_postal_code2 varchar2(50),                 
      company_address2 varchar2(255),                    
      company_telephone1 varchar2(100),                  
      company_fax1 varchar2(100),                        
      company_telephone2 varchar2(100),                  
      company_fax2 varchar2(100),                        
     customer_name varchar2(50),                         
      customer_gender varchar2(50),                      
     dept varchar2(50),                                  
     position_ varchar2(50),                             
      customer_picture varchar2(50),                     
        customer_resident_number varchar2(20),           
        customer_birthday date,                          
       customer_lunar_birthday varchar2(10),             
         customer_solar_curr_birthday date,              
       home_postal_code varchar2(50),                    
        home_address varchar2(255),                      
        home_telephone varchar2(100)                     
  );
