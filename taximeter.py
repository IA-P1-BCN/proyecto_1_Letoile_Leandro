import time


RATE_STOPPED = 0.02
RATE_MOVING = 0.05


def show_instructions():
    print("\n🚕 TaxiTech Solutions — Taxímetro Digital")
    print("------------------------------------------")
    print("Comandos disponibles:")
    print("  start  → iniciar una carrera")
    print("  move   → taxi en movimiento")
    print("  stop   → taxi detenido")
    print("  finish → finalizar una carrera")
    print("  quit   → salir del programa")


def main():
    print("🚕 Bienvenido al Taxímetro Digital")

    trip_active = False
    state = "stopped"

    state_start_time = None
    stopped_time = 0
    moving_time = 0

    while True:
        show_instructions()
        command = input("\n> ").strip().lower()

        if command == "start":
            if trip_active:
                print("\n⚠️ Ya hay una carrera en curso")
            else:
                trip_active = True
                state = "stopped"

                stopped_time = 0
                moving_time = 0

                state_start_time = time.time()

                print("\n🚕 Carrera iniciada")
                print("🛑 Estado: detenido")
                print("💰 Tarifa: 0.02 €/segundo")

        elif command == "move":
            if not trip_active:
                print("\n⚠️ No hay ninguna carrera en curso")
            elif state == "moving":
                print("\n⚠️ El taxi ya está en movimiento")
            else:
                current_time = time.time()

                stopped_time += current_time - state_start_time

                state = "moving"
                state_start_time = current_time

                print("\n🚗 Estado: en movimiento")
                print("💰 Tarifa: 0.05 €/segundo")

        elif command == "stop":
            if not trip_active:
                print("\n⚠️ No hay ninguna carrera en curso")
            elif state == "stopped":
                print("\n⚠️ El taxi ya está detenido")
            else:
                current_time = time.time()

                moving_time += current_time - state_start_time

                state = "stopped"
                state_start_time = current_time

                print("\n🛑 Estado: detenido")
                print("💰 Tarifa: 0.02 €/segundo")

        elif command == "finish":
            if not trip_active:
                print("\n⚠️ No hay ninguna carrera en curso")
            else:
                current_time = time.time()

                # Acumulamos el tiempo del último estado
                if state == "moving":
                    moving_time += current_time - state_start_time
                else:
                    stopped_time += current_time - state_start_time

                stopped_cost = stopped_time * RATE_STOPPED
                moving_cost = moving_time * RATE_MOVING

                total = stopped_cost + moving_cost

                print("\n🏁 Carrera finalizada")
                print(f"🛑 Tiempo detenido: {stopped_time:.2f} segundos")
                print(f"🚗 Tiempo en movimiento: {moving_time:.2f} segundos")
                print(f"💰 Coste detenido: €{stopped_cost:.2f}")
                print(f"💰 Coste movimiento: €{moving_cost:.2f}")
                print(f"💵 TOTAL: €{total:.2f}")

                trip_active = False
                state_start_time = None
                stopped_time = 0
                moving_time = 0

        elif command == "quit":
            print("\n👋 Programa finalizado")
            break

        else:
            print("\n❌ Comando no válido")


if __name__ == "__main__":
    main()