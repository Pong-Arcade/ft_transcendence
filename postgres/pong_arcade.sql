--
-- PostgreSQL database dump
--

-- Dumped from database version 15.2 (Debian 15.2-1.pgdg110+1)
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

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: pg_database_owner
--

CREATE SCHEMA public;


ALTER SCHEMA public OWNER TO pg_database_owner;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: pg_database_owner
--

COMMENT ON SCHEMA public IS 'standard public schema';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: ladder_stat; Type: TABLE; Schema: public; Owner: arcade
--

CREATE TABLE public.ladder_stat (
    user_id integer NOT NULL,
    win_count integer NOT NULL,
    lose_count integer NOT NULL,
    ladder_score integer NOT NULL
);


ALTER TABLE public.ladder_stat OWNER TO arcade;

--
-- Name: TABLE ladder_stat; Type: COMMENT; Schema: public; Owner: arcade
--

COMMENT ON TABLE public.ladder_stat IS '래더 게임 통계';


--
-- Name: COLUMN ladder_stat.user_id; Type: COMMENT; Schema: public; Owner: arcade
--

COMMENT ON COLUMN public.ladder_stat.user_id IS '유저의 ID';


--
-- Name: COLUMN ladder_stat.win_count; Type: COMMENT; Schema: public; Owner: arcade
--

COMMENT ON COLUMN public.ladder_stat.win_count IS '승리 횟수';


--
-- Name: COLUMN ladder_stat.lose_count; Type: COMMENT; Schema: public; Owner: arcade
--

COMMENT ON COLUMN public.ladder_stat.lose_count IS '패배 횟수';


--
-- Name: COLUMN ladder_stat.ladder_score; Type: COMMENT; Schema: public; Owner: arcade
--

COMMENT ON COLUMN public.ladder_stat.ladder_score IS '래더 점수';


--
-- Name: match_history; Type: TABLE; Schema: public; Owner: arcade
--

CREATE TABLE public.match_history (
    history_id integer NOT NULL,
    red_user_id integer DEFAULT 0 NOT NULL,
    blue_user_id integer DEFAULT 0 NOT NULL,
    red_score integer NOT NULL,
    blue_score integer NOT NULL,
    begin_time date NOT NULL,
    end_time date NOT NULL
);


ALTER TABLE public.match_history OWNER TO arcade;

--
-- Name: TABLE match_history; Type: COMMENT; Schema: public; Owner: arcade
--

COMMENT ON TABLE public.match_history IS '대전 기록 테이블';


--
-- Name: COLUMN match_history.red_user_id; Type: COMMENT; Schema: public; Owner: arcade
--

COMMENT ON COLUMN public.match_history.red_user_id IS '레드팀 유저 ID';


--
-- Name: COLUMN match_history.blue_user_id; Type: COMMENT; Schema: public; Owner: arcade
--

COMMENT ON COLUMN public.match_history.blue_user_id IS '블루팀 유저 ID';


--
-- Name: COLUMN match_history.red_score; Type: COMMENT; Schema: public; Owner: arcade
--

COMMENT ON COLUMN public.match_history.red_score IS '레드팀 점수';


--
-- Name: COLUMN match_history.blue_score; Type: COMMENT; Schema: public; Owner: arcade
--

COMMENT ON COLUMN public.match_history.blue_score IS '블루팀 점수';


--
-- Name: COLUMN match_history.begin_time; Type: COMMENT; Schema: public; Owner: arcade
--

COMMENT ON COLUMN public.match_history.begin_time IS '게임 시작 시간
';


--
-- Name: COLUMN match_history.end_time; Type: COMMENT; Schema: public; Owner: arcade
--

COMMENT ON COLUMN public.match_history.end_time IS '게임 종료 시간';


--
-- Name: match_history_history_id_seq; Type: SEQUENCE; Schema: public; Owner: arcade
--

CREATE SEQUENCE public.match_history_history_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.match_history_history_id_seq OWNER TO arcade;

--
-- Name: match_history_history_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: arcade
--

ALTER SEQUENCE public.match_history_history_id_seq OWNED BY public.match_history.history_id;


--
-- Name: normal_stat; Type: TABLE; Schema: public; Owner: arcade
--

CREATE TABLE public.normal_stat (
    user_id integer NOT NULL,
    win_count integer NOT NULL,
    lose_count integer NOT NULL
);


ALTER TABLE public.normal_stat OWNER TO arcade;

--
-- Name: TABLE normal_stat; Type: COMMENT; Schema: public; Owner: arcade
--

COMMENT ON TABLE public.normal_stat IS '일반 게임 통계';


--
-- Name: COLUMN normal_stat.user_id; Type: COMMENT; Schema: public; Owner: arcade
--

COMMENT ON COLUMN public.normal_stat.user_id IS '유저의 ID';


--
-- Name: COLUMN normal_stat.win_count; Type: COMMENT; Schema: public; Owner: arcade
--

COMMENT ON COLUMN public.normal_stat.win_count IS '승리 횟수';


--
-- Name: COLUMN normal_stat.lose_count; Type: COMMENT; Schema: public; Owner: arcade
--

COMMENT ON COLUMN public.normal_stat.lose_count IS '패배횟수';


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
-- Name: match_history history_id; Type: DEFAULT; Schema: public; Owner: arcade
--

ALTER TABLE ONLY public.match_history ALTER COLUMN history_id SET DEFAULT nextval('public.match_history_history_id_seq'::regclass);


--
-- Data for Name: ladder_stat; Type: TABLE DATA; Schema: public; Owner: arcade
--

COPY public.ladder_stat (user_id, win_count, lose_count, ladder_score) FROM stdin;
\.


--
-- Data for Name: match_history; Type: TABLE DATA; Schema: public; Owner: arcade
--

COPY public.match_history (history_id, red_user_id, blue_user_id, red_score, blue_score, begin_time, end_time) FROM stdin;
\.


--
-- Data for Name: normal_stat; Type: TABLE DATA; Schema: public; Owner: arcade
--

COPY public.normal_stat (user_id, win_count, lose_count) FROM stdin;
\.


--
-- Data for Name: relation; Type: TABLE DATA; Schema: public; Owner: arcade
--

COPY public.relation (user_id, other_user_id, relation_type) FROM stdin;
\.


--
-- Data for Name: user; Type: TABLE DATA; Schema: public; Owner: arcade
--

COPY public."user" (user_id, nickname, avatar_url, email) FROM stdin;
85330	sichoi	https://cdn.intra.42.fr/users/6b58f90b32b08da5c68579c72f884599/sichoi.jpg	sichoi@student.42seoul.kr
\.


--
-- Name: match_history_history_id_seq; Type: SEQUENCE SET; Schema: public; Owner: arcade
--

SELECT pg_catalog.setval('public.match_history_history_id_seq', 1, false);


--
-- Name: ladder_stat ladder_stat_pk; Type: CONSTRAINT; Schema: public; Owner: arcade
--

ALTER TABLE ONLY public.ladder_stat
    ADD CONSTRAINT ladder_stat_pk PRIMARY KEY (user_id);


--
-- Name: match_history match_history_pk; Type: CONSTRAINT; Schema: public; Owner: arcade
--

ALTER TABLE ONLY public.match_history
    ADD CONSTRAINT match_history_pk PRIMARY KEY (history_id);


--
-- Name: normal_stat normal_stat_pk; Type: CONSTRAINT; Schema: public; Owner: arcade
--

ALTER TABLE ONLY public.normal_stat
    ADD CONSTRAINT normal_stat_pk PRIMARY KEY (user_id);


--
-- Name: normal_stat normal_stat_user_id_key; Type: CONSTRAINT; Schema: public; Owner: arcade
--

ALTER TABLE ONLY public.normal_stat
    ADD CONSTRAINT normal_stat_user_id_key UNIQUE (user_id);


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
-- Name: user user_nickname_key; Type: CONSTRAINT; Schema: public; Owner: arcade
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_nickname_key UNIQUE (nickname);


--
-- Name: user user_pk; Type: CONSTRAINT; Schema: public; Owner: arcade
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_pk PRIMARY KEY (user_id);


--
-- Name: user user_user_id_key; Type: CONSTRAINT; Schema: public; Owner: arcade
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_user_id_key UNIQUE (user_id);


--
-- Name: ladder_stat ladder_stat_user_null_fk; Type: FK CONSTRAINT; Schema: public; Owner: arcade
--

ALTER TABLE ONLY public.ladder_stat
    ADD CONSTRAINT ladder_stat_user_null_fk FOREIGN KEY (user_id) REFERENCES public."user"(user_id);


--
-- Name: match_history match_history___fk1; Type: FK CONSTRAINT; Schema: public; Owner: arcade
--

ALTER TABLE ONLY public.match_history
    ADD CONSTRAINT match_history___fk1 FOREIGN KEY (red_user_id) REFERENCES public."user"(user_id) ON UPDATE CASCADE ON DELETE SET DEFAULT;


--
-- Name: match_history match_history___fk2; Type: FK CONSTRAINT; Schema: public; Owner: arcade
--

ALTER TABLE ONLY public.match_history
    ADD CONSTRAINT match_history___fk2 FOREIGN KEY (blue_user_id) REFERENCES public."user"(user_id) ON UPDATE CASCADE ON DELETE SET DEFAULT;


--
-- Name: normal_stat normal_stat_user_null_fk; Type: FK CONSTRAINT; Schema: public; Owner: arcade
--

ALTER TABLE ONLY public.normal_stat
    ADD CONSTRAINT normal_stat_user_null_fk FOREIGN KEY (user_id) REFERENCES public."user"(user_id);


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

