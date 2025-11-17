import { Test, TestingModule } from "@nestjs/testing";

import { applyMockAccessTokenGuard } from "@src/test/utils/mock-guards";

import { AgendaController } from "./agenda.controller";
import { AgendaService } from "./agenda.service";

describe("AgendaController", () => {
  let controller: AgendaController;
  let mockService: Partial<AgendaService>;

  const mockEvent = {
    event_id: "evt-1",
    user_id: "user-1",
    title: "Meeting",
    start_at: new Date("2025-01-01T10:00:00.000Z"),
    end_at: new Date("2025-01-01T11:00:00.000Z"),
  } as any;

  beforeEach(async () => {
    mockService = {
      create: jest.fn().mockResolvedValue(mockEvent),
      findOne: jest.fn().mockResolvedValue(mockEvent),
      update: jest.fn().mockResolvedValue({ ...mockEvent, title: "Updated" }),
      remove: jest.fn().mockResolvedValue(true),
      listForRange: jest.fn().mockResolvedValue([mockEvent]),
    } as Partial<AgendaService>;

    const moduleBuilder = Test.createTestingModule({
      controllers: [AgendaController],
      providers: [
        {
          provide: AgendaService,
          useValue: mockService,
        },
      ],
    });

    // override the real guard so JwtService and DB repos are not required in unit tests
    const module: TestingModule =
      await applyMockAccessTokenGuard(moduleBuilder).compile();

    controller = module.get<AgendaController>(AgendaController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("create", () => {
    it("should forward create to service", async () => {
      const dto = { title: "Meeting" } as any;
      const res = await controller.create("user-1", dto);
      expect(res).toEqual(mockEvent);
      expect(mockService.create).toHaveBeenCalledWith("user-1", dto);
    });
  });

  describe("getOne", () => {
    it("should return event when found", async () => {
      (mockService.findOne as jest.Mock).mockResolvedValue(mockEvent);
      const res = await controller.getOne("user-1", "evt-1");
      expect(res).toEqual(mockEvent);
    });

    it("should return empty object when not found", async () => {
      (mockService.findOne as jest.Mock).mockResolvedValue(null);
      const res = await controller.getOne("user-1", "nope");
      expect(res).toEqual({});
    });
  });

  describe("update", () => {
    it("should forward update to service", async () => {
      const dto = { title: "Updated" } as any;
      const res = await controller.update("user-1", "evt-1", dto);
      expect(res).toEqual({ ...mockEvent, title: "Updated" });
      expect(mockService.update).toHaveBeenCalledWith("user-1", "evt-1", dto);
    });
  });

  describe("remove", () => {
    it("should forward remove to service", async () => {
      const res = await controller.remove("user-1", "evt-1");
      expect(res).toBe(true);
      expect(mockService.remove).toHaveBeenCalledWith("user-1", "evt-1");
    });
  });

  describe("list", () => {
    it("should call service.listForRange and return events when query provided", async () => {
      const query = { start_at: "2025-01-01T00:00:00.000Z", end_at: "2025-01-08T00:00:00.000Z" } as any;
      const res = await controller.list("user-1", query);
      expect(res).toEqual([mockEvent]);
      expect(mockService.listForRange).toHaveBeenCalled();
    });

    it("should default to one week range when 'end_at' not provided", async () => {
      const query = { start_at: "2025-01-01T00:00:00.000Z" } as any;
      const res = await controller.list("user-1", query);
      expect(res).toEqual([mockEvent]);
      expect(mockService.listForRange).toHaveBeenCalled();
    });

    it("should default to current week when no query provided", async () => {
      const query = {} as any;
      const res = await controller.list("user-1", query);
      expect(res).toEqual([mockEvent]);
      expect(mockService.listForRange).toHaveBeenCalled();
    });
  });
});
