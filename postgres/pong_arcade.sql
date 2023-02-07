--
-- PostgreSQL database dump
--

-- Dumped from database version 15.1 (Debian 15.1-1.pgdg110+1)
-- Dumped by pg_dump version 15.1 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: relation; Type: TABLE; Schema: public; Owner: arcade
--

CREATE TABLE public.relation (
    user_id integer NOT NULL,
    other_user_id integer NOT NULL,
    relation_type character varying(16) NOT NULL
);


ALTER TABLE public.relation OWNER TO arcade;

--
-- Name: COLUMN relation.user_id; Type: COMMENT; Schema: public; Owner: arcade
--

COMMENT ON COLUMN public.relation.user_id IS '유저의 ID';


--
-- Name: COLUMN relation.other_user_id; Type: COMMENT; Schema: public; Owner: arcade
--

COMMENT ON COLUMN public.relation.other_user_id IS '유저가 관계를 갖는 다른 유저의 ID';


--
-- Name: COLUMN relation.relation_type; Type: COMMENT; Schema: public; Owner: arcade
--

COMMENT ON COLUMN public.relation.relation_type IS '관계 유형';


--
-- Name: user; Type: TABLE; Schema: public; Owner: arcade
--

CREATE TABLE public."user" (
    user_id integer NOT NULL,
    nickname character varying(32) NOT NULL,
    avatar_url text,
    email character varying(64)
);


ALTER TABLE public."user" OWNER TO arcade;

--
-- Name: TABLE "user"; Type: COMMENT; Schema: public; Owner: arcade
--

COMMENT ON TABLE public."user" IS '유저 테이블';


--
-- Name: COLUMN "user".user_id; Type: COMMENT; Schema: public; Owner: arcade
--

COMMENT ON COLUMN public."user".user_id IS '유저의 ID';


--
-- Name: COLUMN "user".nickname; Type: COMMENT; Schema: public; Owner: arcade
--

COMMENT ON COLUMN public."user".nickname IS '유저의 닉네임';


--
-- Name: COLUMN "user".avatar_url; Type: COMMENT; Schema: public; Owner: arcade
--

COMMENT ON COLUMN public."user".avatar_url IS '유저의 아바타 이미지 url';


--
-- Name: COLUMN "user".email; Type: COMMENT; Schema: public; Owner: arcade
--

COMMENT ON COLUMN public."user".email IS '유저의 이메일';


--
-- Data for Name: relation; Type: TABLE DATA; Schema: public; Owner: arcade
--

COPY public.relation (user_id, other_user_id, relation_type) FROM stdin;
\.


--
-- Data for Name: user; Type: TABLE DATA; Schema: public; Owner: arcade
--

COPY public."user" (user_id, nickname, avatar_url, email) FROM stdin;
\.


--
-- Name: relation relation_pk; Type: CONSTRAINT; Schema: public; Owner: arcade
--

ALTER TABLE ONLY public.relation
    ADD CONSTRAINT relation_pk PRIMARY KEY (user_id, other_user_id);


--
-- Name: user user_email_key; Type: CONSTRAINT; Schema: public; Owner: arcade
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_email_key UNIQUE (email);


--
-- Name: user user_pk; Type: CONSTRAINT; Schema: public; Owner: arcade
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_pk PRIMARY KEY (user_id);


--
-- Name: relation relation_user_fk1; Type: FK CONSTRAINT; Schema: public; Owner: arcade
--

ALTER TABLE ONLY public.relation
    ADD CONSTRAINT relation_user_fk1 FOREIGN KEY (user_id) REFERENCES public."user"(user_id);


--
-- Name: relation relation_user_fk2; Type: FK CONSTRAINT; Schema: public; Owner: arcade
--

ALTER TABLE ONLY public.relation
    ADD CONSTRAINT relation_user_fk2 FOREIGN KEY (other_user_id) REFERENCES public."user"(user_id);


--
-- PostgreSQL database dump complete
--

