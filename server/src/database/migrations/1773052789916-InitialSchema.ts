import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1773052789916 implements MigrationInterface {
    name = 'InitialSchema1773052789916'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "devices" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "device_id" character varying NOT NULL, "therapist_id" uuid NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_2667f40edb344d6f274a0d42b6f" UNIQUE ("device_id"), CONSTRAINT "PK_b1514758245c12daf43486dd1f0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "sessions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "therapist_id" uuid NOT NULL, "patient_identifier" character varying, "session_settings" jsonb NOT NULL, "duration" integer NOT NULL, "session_timestamp" TIMESTAMP NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_3238ef96f18b355b671619111bc" PRIMARY KEY ("id")); COMMENT ON COLUMN "sessions"."duration" IS 'Duration in seconds'`);
        await queryRunner.query(`CREATE TABLE "therapists" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_9d6f686b5fb481d1b9d513f3421" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "devices" ADD CONSTRAINT "FK_aba5dd488c379d85d300c75cb11" FOREIGN KEY ("therapist_id") REFERENCES "therapists"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sessions" ADD CONSTRAINT "FK_873b2cad08bd8d41f11af3d9f4c" FOREIGN KEY ("therapist_id") REFERENCES "therapists"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sessions" DROP CONSTRAINT "FK_873b2cad08bd8d41f11af3d9f4c"`);
        await queryRunner.query(`ALTER TABLE "devices" DROP CONSTRAINT "FK_aba5dd488c379d85d300c75cb11"`);
        await queryRunner.query(`DROP TABLE "therapists"`);
        await queryRunner.query(`DROP TABLE "sessions"`);
        await queryRunner.query(`DROP TABLE "devices"`);
    }

}
