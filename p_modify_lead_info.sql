DROP PROCEDURE IF EXISTS p_modify_lead_info;


CREATE OR REPLACE PROCEDURE p_modify_lead_info(
i_action_type                in text,   -- 'ADD', 'UPDATE'
i_leads_code                 in text,   -- ADD일때는 들어오면 안되고, UPDATE일때는 반드시 들어와야
i_company_code               in text ,
i_leads_index                in integer ,
i_company_index              in integer ,
i_lead_number                in text ,
i_group_                     in text ,
i_sales_resource             in text ,
i_region                     in text ,
i_company_name               in text ,
i_company_zip_code           in text ,
i_company_address            in text ,
i_company_phone_number       in text ,
i_company_fax_number         in text ,
i_leads_name                 in text ,
i_is_keyman                  in text ,
i_department                 in text ,
i_position                   in text ,
i_mobile_number              in text ,
i_company_name_en            in text ,
i_email                      in text ,
i_homepage                   in text ,
i_modify_user                in text ,
i_counter                    in integer ,
i_application_engineer       in text ,
i_status                     in text ,
x_leads_code                 out text,
x_create_user                out text,
x_create_date                out text,
x_modify_date                out text,
x_recent_user                out text        
 )
LANGUAGE plpgsql
AS $$
DECLARE
    v_uuid_lead_code text;
    v_lead_code text;
    v_current_date date; 
BEGIN
    select now() into v_current_date;

    -- leads 추가 
    if(i_action_type = 'ADD') then  
       -- lead code 생성 
       SELECT uuid_generate_v4() into v_uuid_lead_code;
       select upper(regexp_replace(v_uuid_lead_code, '[-]','','g')) into v_lead_code;

       insert into tbl_leads_info(
           leads_code               ,
           company_code            ,
           leads_index             ,
           company_index           ,
           lead_number             ,
           group_                  ,
           sales_resource          ,
           region                  ,
           company_name            ,
           company_zip_code        ,
           company_address         ,
           company_phone_number    ,
           company_fax_number      ,
           leads_name              ,
           is_keyman               ,
           department              ,
           position                ,
           mobile_number           ,
           company_name_en         ,
           email                   ,
           homepage                ,
           create_user             ,
           create_date             ,
           modify_date             ,
           recent_user             ,
           counter                 ,
           application_engineer    ,
           status                    )
        values(
           v_lead_code              ,
           i_company_code            ,
           i_leads_index             ,
           i_company_index           ,
           i_lead_number             ,
           i_group_                  ,
           i_sales_resource          ,
           i_region                  ,
           i_company_name            ,
           i_company_zip_code        ,
           i_company_address         ,
           i_company_phone_number    ,
           i_company_fax_number      ,
           i_leads_name              ,
           i_is_keyman               ,
           i_department              ,
           i_position                ,
           i_mobile_number           ,
           i_company_name_en         ,
           i_email                   ,
           i_homepage                ,
           i_modify_user             ,
           now()                     ,
           now()                     ,
           i_modify_user             ,
           i_counter                 ,
           i_application_engineer    ,
           i_status                   );

    elsif (i_action_type = 'UPDATE') then  
       update tbl_leads_info 
       set company_code   =  COALESCE(i_company_code,company_code)         ,
           lead_number          = COALESCE(i_lead_number, lead_number)   ,
           group_               = COALESCE(i_group_ , group_)   ,
           sales_resource       = COALESCE(i_sales_resource, sales_resource)   ,
           region               = COALESCE(i_region, region)   ,
           company_name         = COALESCE(i_company_name, company_name)   ,
           company_zip_code     = COALESCE(i_company_zip_code, company_zip_code)   ,
           company_address      = COALESCE(i_company_address, company_address)   ,
           company_phone_number = COALESCE(i_company_phone_number, company_phone_number)   ,
           company_fax_number   = COALESCE(i_company_fax_number, company_fax_number)   ,
           leads_name           = COALESCE(i_leads_name, leads_name)   ,
           is_keyman            = COALESCE(i_is_keyman, is_keyman)   ,
           department           = COALESCE(i_department, department)   ,
           position             = COALESCE(i_position, position)   ,
           mobile_number        = COALESCE(i_mobile_number, mobile_number)   ,
           company_name_en      = COALESCE(i_company_name_en, company_name_en)   ,
           email                = COALESCE(i_email, email)   ,
           homepage             = COALESCE(i_homepage, homepage)   ,
           modify_date          = now()   ,
           recent_user          = i_modify_user   ,
           application_engineer = COALESCE(i_application_engineer, application_engineer)   ,
           status               = COALESCE(i_status, status)    
       where leads_code = i_leads_code;

       if i_counter != 0  then
          update tbl_leads_info
          set counter = i_counter
          where leads_code = i_leads_code;
       end if;
       if i_leads_index != 0  then
          update tbl_leads_info
          set leads_index = i_leads_index
          where leads_code = i_leads_code;
       end if;
       if i_company_index != 0  then
          update tbl_leads_info
          set company_index = i_company_index
          where leads_code = i_leads_code;
       end if;       

    end if;

    -- log 생성 
	insert into tbl_logs(user_id, table_name, action_type, parameter, parameter_value, creation_date)
	values(i_modify_user, 'tbl_lead_info', i_action_type, 
        'lead_code,company_code,leads_index,company_index,lead_number,group_,sales_resource,
        region,company_name,company_zip_code,company_address,company_phone_number,company_fax_number,
        leads_name,is_keyman,department,position,mobile_number,company_name_en,email,homepage,create_user,
        create_date,modify_date,recent_user,counter,application_engineer,status' ,
        v_lead_code||','||i_company_code||','||i_leads_index||','||i_company_index||','||i_lead_number||','||
        i_group_||','||i_sales_resource||','||i_region||','||i_company_name||','||i_company_zip_code||','||
        i_company_address||','||i_company_phone_number||','||i_company_fax_number||','||i_leads_name||','||
        i_is_keyman||','||i_department||','||i_position||','||i_mobile_number||','||i_company_name_en||','||
        i_email||','||i_homepage||','||i_modify_user||','||v_current_date||','||v_current_date||','||i_modify_user||','||
        i_counter||','||i_application_engineer||','||i_status, now());

    -- out parameter 
    if( i_action_type = 'ADD') then
      x_leads_code   := v_lead_code; 
      x_create_user  := i_modify_user;
      x_create_date     := v_current_date::text; 
      x_modify_date     := v_current_date::text; 
      x_recent_user     := i_modify_user;
    elsif(i_action_type = 'UPDATE') then
      x_leads_code := i_leads_code; 
      x_modify_date     := v_current_date::text; 
      x_recent_user     := i_modify_user;      
    end if;

END;
$$;

-- create lead
call p_modify_lead_info(
'ADD',    -- 'ADD', 'UPDATE'
'',    -- ADD일때는 들어오면 안되고, UPDATE일때는 반드시 들어와야
'218D8B066AE35B43AEC661EE78506073', 
0, 
0, 
'', 
'공유그룹/사용고객;공유그룹/사용고객/SolidWorks 사용고객;공유그룹/기타;', 
'정우진' , 
'서울', 
'다쏘시스템코리아 주식회사', 
'6164', 
'서울특별시 강남구 영동대로 517 (삼성동,아셈타워 901호)', 
'', 
'' , 
'박지원', 
'', 
'', 
'대표', 
'010-9975-8983', 
'', 
'jeewon.park@3ds.com', 
'http://n-sys.co.kr', 
'wjjung', 
0, 
'', 
'', 
'', -- x_leads_code                 out text,
'', -- x_create_user                out text,
'', -- x_create_date                out text,
'', -- x_modify_date                out text,
'');  -- x_recent_user                out text   


-- modify lead
call p_modify_lead_info(
'UPDATE',    -- 'ADD', 'UPDATE'
'1234D25CD9D54547BD195D7C7BF2FB7A',    -- ADD일때는 들어오면 안되고, UPDATE일때는 반드시 들어와야
'111', 
11110, 
0, 
'', 
'공유그룹/기타;', 
'최형성' , 
'서울', 
'다쏘시스템코리아', 
'6164', 
'서울특별시 ', 
'', 
'' , 
'최형성', 
'', 
'', 
'대표', 
'010-0000-0000', 
'', 
'jeewon.park@3ds.com', 
'http://n-sys.co.kr', 
'wjjung', 
0, 
'', 
'', 
'', -- x_leads_code                 out text,
'', -- x_create_user                out text,
'', -- x_create_date                out text,
'', -- x_modify_date                out text,
'');  -- x_recent_user                out text   