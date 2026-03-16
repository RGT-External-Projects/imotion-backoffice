import { MigrationInterface, QueryRunner } from "typeorm";

export class NewDatabaseStructure1773143580896 implements MigrationInterface {
    name = 'NewDatabaseStructure1773143580896'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sessions" DROP CONSTRAINT "FK_873b2cad08bd8d41f11af3d9f4c"`);
        await queryRunner.query(`ALTER TABLE "devices" DROP CONSTRAINT "FK_aba5dd488c379d85d300c75cb11"`);
        await queryRunner.query(`CREATE TABLE "roles" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" character varying, "permissions" jsonb NOT NULL DEFAULT '[]', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_648e3f5447f725579d7d4ffdfb7" UNIQUE ("name"), CONSTRAINT "PK_c1433d71a4838793a49dcad46ab" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "password_hash" character varying NOT NULL, "full_name" character varying NOT NULL, "role_id" uuid NOT NULL, "is_active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "patients" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "patient_code" character varying NOT NULL, "display_name" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_72398f0b54d401540321d5db8bf" UNIQUE ("patient_code"), CONSTRAINT "PK_a7f0b9fcbb3469d5ec0b0aceaa7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "therapist_phones" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "phone_number" character varying NOT NULL, "display_name" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_0f149acc3d057ad5f1538acd233" UNIQUE ("phone_number"), CONSTRAINT "PK_c00fecfaef945927943887fcc08" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "device_therapist_phones" ("therapist_phone_id" uuid NOT NULL, "device_id" uuid NOT NULL, CONSTRAINT "PK_62c428814fc4ba36e96ce677063" PRIMARY KEY ("therapist_phone_id", "device_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_e3db5ec69c7ceaf069240d186c" ON "device_therapist_phones" ("therapist_phone_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_328f67e8a8efebee4be0d77d77" ON "device_therapist_phones" ("device_id") `);
        await queryRunner.query(`ALTER TABLE "sessions" DROP COLUMN "therapist_id"`);
        await queryRunner.query(`ALTER TABLE "sessions" DROP COLUMN "patient_identifier"`);
        await queryRunner.query(`ALTER TABLE "devices" DROP COLUMN "therapist_id"`);
        await queryRunner.query(`ALTER TABLE "sessions" ADD "device_id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "sessions" ADD "therapist_phone_id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "sessions" ADD "patient_id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "devices" ADD "device_name" character varying`);
        await queryRunner.query(`ALTER TABLE "devices" ADD "serial_number" character varying`);
        await queryRunner.query(`ALTER TABLE "devices" ADD CONSTRAINT "UQ_cc9e89897e336172fd06367735d" UNIQUE ("serial_number")`);
        await queryRunner.query(`ALTER TABLE "devices" ADD "is_active" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_a2cecd1a3531c0b041e29ba46e1" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sessions" ADD CONSTRAINT "FK_97207844c19e5c27d33a07f67c0" FOREIGN KEY ("device_id") REFERENCES "devices"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sessions" ADD CONSTRAINT "FK_d31fe0de240e85f62fa0742477e" FOREIGN KEY ("therapist_phone_id") REFERENCES "therapist_phones"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sessions" ADD CONSTRAINT "FK_b53ef4073197ef9be0c1d914c54" FOREIGN KEY ("patient_id") REFERENCES "patients"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "device_therapist_phones" ADD CONSTRAINT "FK_e3db5ec69c7ceaf069240d186c3" FOREIGN KEY ("therapist_phone_id") REFERENCES "therapist_phones"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "device_therapist_phones" ADD CONSTRAINT "FK_328f67e8a8efebee4be0d77d772" FOREIGN KEY ("device_id") REFERENCES "devices"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "device_therapist_phones" DROP CONSTRAINT "FK_328f67e8a8efebee4be0d77d772"`);
        await queryRunner.query(`ALTER TABLE "device_therapist_phones" DROP CONSTRAINT "FK_e3db5ec69c7ceaf069240d186c3"`);
        await queryRunner.query(`ALTER TABLE "sessions" DROP CONSTRAINT "FK_b53ef4073197ef9be0c1d914c54"`);
        await queryRunner.query(`ALTER TABLE "sessions" DROP CONSTRAINT "FK_d31fe0de240e85f62fa0742477e"`);
        await queryRunner.query(`ALTER TABLE "sessions" DROP CONSTRAINT "FK_97207844c19e5c27d33a07f67c0"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_a2cecd1a3531c0b041e29ba46e1"`);
        await queryRunner.query(`ALTER TABLE "devices" DROP COLUMN "is_active"`);
        await queryRunner.query(`ALTER TABLE "devices" DROP CONSTRAINT "UQ_cc9e89897e336172fd06367735d"`);
        await queryRunner.query(`ALTER TABLE "devices" DROP COLUMN "serial_number"`);
        await queryRunner.query(`ALTER TABLE "devices" DROP COLUMN "device_name"`);
        await queryRunner.query(`ALTER TABLE "sessions" DROP COLUMN "patient_id"`);
        await queryRunner.query(`ALTER TABLE "sessions" DROP COLUMN "therapist_phone_id"`);
        await queryRunner.query(`ALTER TABLE "sessions" DROP COLUMN "device_id"`);
        await queryRunner.query(`ALTER TABLE "devices" ADD "therapist_id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "sessions" ADD "patient_identifier" character varying`);
        await queryRunner.query(`ALTER TABLE "sessions" ADD "therapist_id" uuid NOT NULL`);
        await queryRunner.query(`DROP INDEX "public"."IDX_328f67e8a8efebee4be0d77d77"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_e3db5ec69c7ceaf069240d186c"`);
        await queryRunner.query(`DROP TABLE "device_therapist_phones"`);
        await queryRunner.query(`DROP TABLE "therapist_phones"`);
        await queryRunner.query(`DROP TABLE "patients"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "roles"`);
        await queryRunner.query(`ALTER TABLE "devices" ADD CONSTRAINT "FK_aba5dd488c379d85d300c75cb11" FOREIGN KEY ("therapist_id") REFERENCES "therapists"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sessions" ADD CONSTRAINT "FK_873b2cad08bd8d41f11af3d9f4c" FOREIGN KEY ("therapist_id") REFERENCES "therapists"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
