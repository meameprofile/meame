-- ============================================================================
-- SCRIPT DE CIMENTACIÓN: FUNCIONES SOBERANAS (v1.0)
-- Manifiesto de Origen: _docs/supabase/000_MANIFIESTO_FUNCIONES_Soberanas.md
-- ============================================================================

-- == FUNCIÓN 1: Guardián de Diagnóstico del Sistema ==
CREATE OR REPLACE FUNCTION public.get_system_diagnostics()
RETURNS json AS $$
DECLARE
    result json;
BEGIN
    SELECT json_build_object(
        'schema_columns', (SELECT json_agg(json_build_object('table', table_name, 'column', column_name, 'type', udt_name)) FROM information_schema.columns WHERE table_schema = 'public'),
        'table_constraints', (SELECT json_agg(json_build_object('table', table_name, 'constraint_name', constraint_name, 'type', constraint_type)) FROM information_schema.table_constraints WHERE table_schema = 'public'),
        'indexes', (SELECT json_agg(json_build_object('table', tablename, 'index_name', indexname)) FROM pg_indexes WHERE schemaname = 'public'),
        'rls_policies', (SELECT json_agg(json_build_object('table', tablename, 'policy_name', policyname, 'command', cmd, 'definition', qual)) FROM pg_policies WHERE schemaname = 'public'),
        'triggers', (SELECT json_agg(json_build_object('trigger_name', trigger_name, 'table', event_object_table, 'timing', action_timing, 'event', event_manipulation)) FROM information_schema.triggers WHERE trigger_schema = 'public'),
        'functions_and_procedures', (SELECT json_agg(json_build_object('name', routine_name, 'type', routine_type)) FROM information_schema.routines WHERE specific_schema = 'public')
    ) INTO result;
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- == FUNCIÓN 2: Sincronización de Perfil para Nuevos Usuarios ==
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id)
  VALUES (new.id);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- == FUNCIÓN 3: Auto-actualización de 'available_languages' en CogniRead ==
CREATE OR REPLACE FUNCTION public.update_cogniread_available_languages()
RETURNS TRIGGER AS $$
BEGIN
    NEW.available_languages = (SELECT array_agg(key) FROM jsonb_object_keys(NEW.content));
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- FIN DE LA CIMENTACIÓN
-- ============================================================================
