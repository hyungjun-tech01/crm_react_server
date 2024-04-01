CREATE OR REPLACE PROCEDURE p_insert_item_tag()
LANGUAGE plpgsql
AS $$
DECLARE
    v_uuid varchar(40);
    v_tag_code varchar(32);
    TARGET_CURSOR record;   -- 커서를 선언 해 주어야 한다. 	
BEGIN

    FOR TARGET_CURSOR IN
        SELECT  tag_code, tag_type, tag_name from  tbl_item_tag_temp  -- 여기에 ; 세미콜론이 없어야 한다. 
    LOOP
	
		select uuid_generate_v4() into v_uuid;

		select upper(regexp_replace(v_uuid, '[-]','','g')) into v_tag_code;

		-- insert 본 테이블 tbl_item_tag
		insert into tbl_item_tag
		(tag_code ,
		tag_type,
		tag_name )
		select v_tag_code, tag_type, tag_name from  tbl_item_tag_temp where tag_code = TARGET_CURSOR.tag_code;	
	
	END LOOP;

END;
$$;

