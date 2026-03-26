import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSessionRestartedEventType1774545740592 implements MigrationInterface {
    name = 'AddSessionRestartedEventType1774545740592'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."session_activity_logs_event_type_enum" RENAME TO "session_activity_logs_event_type_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."session_activity_logs_event_type_enum" AS ENUM('SESSION_STARTED', 'SETTINGS_CHANGED', 'SESSION_PAUSED', 'SESSION_RESUMED', 'SESSION_RESTARTED', 'SESSION_COMPLETED', 'SESSION_INTERRUPTED')`);
        await queryRunner.query(`ALTER TABLE "session_activity_logs" ALTER COLUMN "event_type" TYPE "public"."session_activity_logs_event_type_enum" USING "event_type"::"text"::"public"."session_activity_logs_event_type_enum"`);
        await queryRunner.query(`DROP TYPE "public"."session_activity_logs_event_type_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."session_activity_logs_event_type_enum_old" AS ENUM('SESSION_STARTED', 'SETTINGS_CHANGED', 'SESSION_PAUSED', 'SESSION_RESUMED', 'SESSION_COMPLETED', 'SESSION_INTERRUPTED')`);
        await queryRunner.query(`ALTER TABLE "session_activity_logs" ALTER COLUMN "event_type" TYPE "public"."session_activity_logs_event_type_enum_old" USING "event_type"::"text"::"public"."session_activity_logs_event_type_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."session_activity_logs_event_type_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."session_activity_logs_event_type_enum_old" RENAME TO "session_activity_logs_event_type_enum"`);
    }

}
