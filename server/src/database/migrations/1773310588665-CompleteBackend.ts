import { MigrationInterface, QueryRunner } from "typeorm";

export class CompleteBackend1773310588665 implements MigrationInterface {
    name = 'CompleteBackend1773310588665'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."session_activity_logs_event_type_enum" AS ENUM('SESSION_STARTED', 'SETTINGS_CHANGED', 'SESSION_PAUSED', 'SESSION_RESUMED', 'SESSION_COMPLETED', 'SESSION_INTERRUPTED')`);
        await queryRunner.query(`CREATE TABLE "session_activity_logs" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "session_id" uuid NOT NULL, "timestamp" TIMESTAMP NOT NULL, "event_type" "public"."session_activity_logs_event_type_enum" NOT NULL, "description" text NOT NULL, "metadata" jsonb, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_6b7b1b0e92ca0be66bb8ceae928" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_f22f658c8b098ab7eb6bb7b48a" ON "session_activity_logs" ("event_type") `);
        await queryRunner.query(`CREATE INDEX "IDX_e7dc7e133feefd0a65dc0e5f0b" ON "session_activity_logs" ("timestamp") `);
        await queryRunner.query(`CREATE INDEX "IDX_bcdafa9b05a9fa751c504aa8bc" ON "session_activity_logs" ("session_id") `);
        await queryRunner.query(`CREATE TYPE "public"."device_activity_logs_event_type_enum" AS ENUM('DEVICE_REGISTERED', 'DEVICE_CONNECTED', 'DEVICE_DISCONNECTED', 'FIRMWARE_UPDATED', 'SESSION_STARTED', 'SESSION_COMPLETED', 'THERAPIST_PHONE_CONNECTED', 'THERAPIST_PHONE_DISCONNECTED')`);
        await queryRunner.query(`CREATE TABLE "device_activity_logs" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "device_id" uuid NOT NULL, "timestamp" TIMESTAMP NOT NULL, "event_type" "public"."device_activity_logs_event_type_enum" NOT NULL, "description" text NOT NULL, "metadata" jsonb, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_bacfebff4daf36c06c8e1194c2f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_b4a4edc2edebda1fd8430f0f06" ON "device_activity_logs" ("event_type") `);
        await queryRunner.query(`CREATE INDEX "IDX_5b323335afa307a3e0e8e60d85" ON "device_activity_logs" ("timestamp") `);
        await queryRunner.query(`CREATE INDEX "IDX_fbc7b0fdae478961e4704f1abb" ON "device_activity_logs" ("device_id") `);
        await queryRunner.query(`CREATE TABLE "notification_settings" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "email_session_completed" boolean NOT NULL DEFAULT true, "email_new_device" boolean NOT NULL DEFAULT false, "email_daily_summary" boolean NOT NULL DEFAULT true, "push_device_disconnected" boolean NOT NULL DEFAULT true, "push_session_interrupted" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_91a7ffebe8b406c4470845d4781" UNIQUE ("user_id"), CONSTRAINT "REL_91a7ffebe8b406c4470845d478" UNIQUE ("user_id"), CONSTRAINT "PK_d131abd7996c475ef768d4559ba" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."notifications_type_enum" AS ENUM('SESSION_COMPLETED', 'SESSION_INTERRUPTED', 'DEVICE_DISCONNECTED', 'NEW_DEVICE', 'DAILY_SUMMARY')`);
        await queryRunner.query(`CREATE TABLE "notifications" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "type" "public"."notifications_type_enum" NOT NULL, "title" character varying NOT NULL, "message" text NOT NULL, "metadata" jsonb, "is_read" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_6a72c3c0f683f6462415e653c3a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_310667f935698fcd8cb319113a" ON "notifications" ("user_id", "created_at") `);
        await queryRunner.query(`CREATE INDEX "IDX_af08fad7c04bb85403970afdc1" ON "notifications" ("user_id", "is_read") `);
        await queryRunner.query(`ALTER TABLE "sessions" DROP COLUMN "session_settings"`);
        await queryRunner.query(`ALTER TABLE "patients" ADD "first_name" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "patients" ADD "last_name" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "patients" ADD "age" integer`);
        await queryRunner.query(`ALTER TABLE "patients" ADD "notes" text`);
        await queryRunner.query(`ALTER TABLE "sessions" ADD "initial_settings" jsonb NOT NULL`);
        await queryRunner.query(`ALTER TABLE "sessions" ADD "final_settings" jsonb`);
        await queryRunner.query(`CREATE TYPE "public"."sessions_status_enum" AS ENUM('IN_PROGRESS', 'PAUSED', 'COMPLETED', 'INTERRUPTED')`);
        await queryRunner.query(`ALTER TABLE "sessions" ADD "status" "public"."sessions_status_enum" NOT NULL DEFAULT 'IN_PROGRESS'`);
        await queryRunner.query(`ALTER TABLE "devices" ADD "firmware_version" character varying`);
        await queryRunner.query(`ALTER TABLE "devices" ADD "last_connected" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "sessions" ALTER COLUMN "duration" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "session_activity_logs" ADD CONSTRAINT "FK_bcdafa9b05a9fa751c504aa8bc7" FOREIGN KEY ("session_id") REFERENCES "sessions"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "device_activity_logs" ADD CONSTRAINT "FK_fbc7b0fdae478961e4704f1abbe" FOREIGN KEY ("device_id") REFERENCES "devices"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "notification_settings" ADD CONSTRAINT "FK_91a7ffebe8b406c4470845d4781" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "notifications" ADD CONSTRAINT "FK_9a8a82462cab47c73d25f49261f" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notifications" DROP CONSTRAINT "FK_9a8a82462cab47c73d25f49261f"`);
        await queryRunner.query(`ALTER TABLE "notification_settings" DROP CONSTRAINT "FK_91a7ffebe8b406c4470845d4781"`);
        await queryRunner.query(`ALTER TABLE "device_activity_logs" DROP CONSTRAINT "FK_fbc7b0fdae478961e4704f1abbe"`);
        await queryRunner.query(`ALTER TABLE "session_activity_logs" DROP CONSTRAINT "FK_bcdafa9b05a9fa751c504aa8bc7"`);
        await queryRunner.query(`ALTER TABLE "sessions" ALTER COLUMN "duration" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "devices" DROP COLUMN "last_connected"`);
        await queryRunner.query(`ALTER TABLE "devices" DROP COLUMN "firmware_version"`);
        await queryRunner.query(`ALTER TABLE "sessions" DROP COLUMN "status"`);
        await queryRunner.query(`DROP TYPE "public"."sessions_status_enum"`);
        await queryRunner.query(`ALTER TABLE "sessions" DROP COLUMN "final_settings"`);
        await queryRunner.query(`ALTER TABLE "sessions" DROP COLUMN "initial_settings"`);
        await queryRunner.query(`ALTER TABLE "patients" DROP COLUMN "notes"`);
        await queryRunner.query(`ALTER TABLE "patients" DROP COLUMN "age"`);
        await queryRunner.query(`ALTER TABLE "patients" DROP COLUMN "last_name"`);
        await queryRunner.query(`ALTER TABLE "patients" DROP COLUMN "first_name"`);
        await queryRunner.query(`ALTER TABLE "sessions" ADD "session_settings" jsonb NOT NULL`);
        await queryRunner.query(`DROP INDEX "public"."IDX_af08fad7c04bb85403970afdc1"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_310667f935698fcd8cb319113a"`);
        await queryRunner.query(`DROP TABLE "notifications"`);
        await queryRunner.query(`DROP TYPE "public"."notifications_type_enum"`);
        await queryRunner.query(`DROP TABLE "notification_settings"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_fbc7b0fdae478961e4704f1abb"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_5b323335afa307a3e0e8e60d85"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b4a4edc2edebda1fd8430f0f06"`);
        await queryRunner.query(`DROP TABLE "device_activity_logs"`);
        await queryRunner.query(`DROP TYPE "public"."device_activity_logs_event_type_enum"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_bcdafa9b05a9fa751c504aa8bc"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_e7dc7e133feefd0a65dc0e5f0b"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_f22f658c8b098ab7eb6bb7b48a"`);
        await queryRunner.query(`DROP TABLE "session_activity_logs"`);
        await queryRunner.query(`DROP TYPE "public"."session_activity_logs_event_type_enum"`);
    }

}
